import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth, getAuthSessionId } from "@convex-dev/auth/server";
import { DataModel } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Scrypt } from "lucia";

// Create a shared Scrypt instance for password operations
const scrypt = new Scrypt();

const PasswordCustom = Password<DataModel>({
    profile(params) {
        return {
            email: params.email as string,
            name: params.name as string,
        };
    },
    validatePasswordRequirements: (password: string) => {
        if (password.length < 8) {
            throw new ConvexError("Password must be at least 8 characters long");
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            throw new ConvexError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
        }
    },
    crypto: {
        async hashSecret(secret: string) {
            return await scrypt.hash(secret);
        },
        async verifySecret(secret: string, hash: string) {
            return await scrypt.verify(hash, secret);
        },
    },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [PasswordCustom],
});

// Password change mutation
export const changePassword = mutation({
    args: {
        currentPassword: v.string(),
        newPassword: v.string(),
    },
    handler: async (ctx, { currentPassword, newPassword }) => {
        // Get the authenticated user ID
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("User is not authenticated");
        }

        // Validate new password requirements
        if (newPassword.length < 8) {
            throw new ConvexError("Password must be at least 8 characters long");
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            throw new ConvexError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
        }

        // Find the user's password account
        const userAccount = await ctx.db
            .query("authAccounts")
            .filter((q) => q.eq(q.field("userId"), userId))
            .filter((q) => q.eq(q.field("provider"), "password"))
            .first();

        if (!userAccount) {
            throw new ConvexError("No password account found for user");
        }

        // Verify the current password using the same Scrypt instance
        if (!userAccount.secret) {
            throw new ConvexError("No password hash found for user");
        }

        const isCurrentPasswordValid = await scrypt.verify(userAccount.secret, currentPassword);
        if (!isCurrentPasswordValid) {
            throw new ConvexError("Current password is incorrect");
        }

        // Hash the new password using the same Scrypt instance
        const newHashedPassword = await scrypt.hash(newPassword);

        // Update the user's password in the database
        await ctx.db.patch(userAccount._id, { secret: newHashedPassword });

        // Invalidate all other sessions for security (except the current one)
        const currentSessionId = await getAuthSessionId(ctx);
        if (currentSessionId) {
            // Get all sessions for this user
            const userSessions = await ctx.db
                .query("authSessions")
                .filter((q) => q.eq(q.field("userId"), userId))
                .collect();

            // Delete all sessions except the current one
            for (const session of userSessions) {
                if (session._id !== currentSessionId) {
                    await ctx.db.delete(session._id);
                }
            }
        }

        return { success: true };
    },
});

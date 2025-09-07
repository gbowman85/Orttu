'use client'
import { Avatar } from "@/components/ui/avatar"
import { api } from "@/../convex/_generated/api"
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserMenu } from "./UserMenu";


export function UserProfileIconFallback() {
    return (
        <Avatar className="size-12">
            <div className="aspect-square h-full w-full bg-gray-100 rounded-full flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            </div>
        </Avatar>
    );
}

export function UserProfileIcon() {
    const user = useQuery(api.data_functions.users.currentUser);

    // If loading, show the fallback
    if (user === undefined) {
        return <UserProfileIconFallback />;
    }

    // If no user is found, show login button
    if (user === null) {
        return (
            <Button asChild variant="secondary">
                <Link href="/login">Login</Link>
            </Button>
        );
    }

    // User is authenticated, show the UserMenu
    return <UserMenu />;
}
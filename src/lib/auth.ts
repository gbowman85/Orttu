import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface AuthHandlerOptions {
  router: AppRouterInstance;
  onSuccess?: (email: string) => void;
  flow?: "signIn" | "signUp";
}

export const handleAuthSuccess = ({ router, onSuccess, flow }: AuthHandlerOptions) => {
  return {
    onSuccess: (email: string) => {
      onSuccess?.(email);
      router.push("/workflows");
    },
    onError: (error: unknown) => {
      console.error(error);
      let toastTitle: string;
      
      if (error instanceof ConvexError && error.data === "INVALID_PASSWORD") {
        toastTitle = "Invalid password - check the requirements and try again.";
      } else {
        toastTitle = flow === "signIn"
          ? "Could not sign in, did you mean to sign up?"
          : "Could not sign up, did you mean to sign in?";
      }
      
      toast.error(toastTitle);
      return false; // Return false to indicate error
    }
  };
}; 
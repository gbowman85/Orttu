'use client'

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleAuthSuccess } from "@/lib/auth";
import { CircleArrowRight } from "lucide-react";

export function SignInWithPassword({
  provider,
  handleSent,
  handlePasswordReset,
  customSignUp: customSignUp,
  passwordRequirements,
}: {
  provider?: string;
  handleSent?: (email: string) => void;
  handlePasswordReset?: () => void;
  customSignUp?: React.ReactNode;
  passwordRequirements?: string;
}) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const authHandler = handleAuthSuccess({
    router,
    onSuccess: handleSent,
    flow
  });

  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        signIn(provider ?? "password", formData)
          .then(() => authHandler.onSuccess(formData.get("email") as string))
          .catch((error) => {
            authHandler.onError(error);
            setSubmitting(false);
          });
      }}
    >
      {flow === "signUp" && (
        <>
          <label htmlFor="name">Name</label>
          <Input name="name" id="name" className="mb-4" autoComplete="name" />
        </>
      )}
      <label htmlFor="email">Email</label>
      <Input name="email" id="email" className="mb-4" autoComplete="email" />
      <div className="flex items-center justify-between">
        <label htmlFor="password">Password</label>
        {handlePasswordReset && flow === "signIn" ? (
          <Button
            className="p-0 h-auto"
            type="button"
            variant="link"
            onClick={handlePasswordReset}
          >
            Forgot your password?
          </Button>
        ) : null}
      </div>
      <Input
        type="password"
        name="password"
        id="password"
        autoComplete={flow === "signIn" ? "current-password" : "new-password"}
      />
      {flow === "signUp" && passwordRequirements !== null && (
        <span className="text-gray-500 font-thin text-sm">
          {passwordRequirements}
        </span>
      )}
      {flow === "signUp" && customSignUp}
      <input name="flow" value={flow} type="hidden" />
      <Button type="submit" disabled={submitting} className="mt-4 w-32 mx-auto">
        <CircleArrowRight />{flow === "signIn" ? "Log in" : "Sign up"}
      </Button>
      <Button
        variant="link"
        type="button"
        onClick={() => {
          setFlow(flow === "signIn" ? "signUp" : "signIn");
        }}
      >
        {flow === "signIn"
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </Button>
    </form>
  );
}

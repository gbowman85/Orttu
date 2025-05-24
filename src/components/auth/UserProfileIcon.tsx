'use client'
import { Avatar } from "@/components/ui/avatar"
import { api } from "../../../convex/_generated/api"
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const getInitials = (name: string) => {
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  return nameParts[0][0].toUpperCase();
};

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
  const user = useQuery(api.user.currentUser);
  
  // If we're still loading, show the fallback
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

  // User is authenticated, show their initials
  const initials = user.name ? getInitials(user.name) : "?";

  return (
    <Avatar className="size-12">
      <div className="aspect-square h-full w-full bg-gray-100 rounded-full flex items-center justify-center font-bold">
        <div className="animate-fade-in">
          {initials}
        </div>
      </div>
    </Avatar>
  );
}
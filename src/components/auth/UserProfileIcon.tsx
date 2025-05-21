'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "../../../convex/_generated/api"
import { useQuery } from "convex/react";

const getInitials = (name: string) => {
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  return nameParts[0][0].toUpperCase();
};

export function UserProfileIcon() {
  const user = useQuery(api.user.currentUser);
  const initials = user?.name ? getInitials(user.name) : "?";

  return (
    <Avatar>
        <div className="aspect-square h-full w-full bg-gray-100 rounded-full flex items-center justify-center">
            {initials}
        </div>
    </Avatar>
  );
}
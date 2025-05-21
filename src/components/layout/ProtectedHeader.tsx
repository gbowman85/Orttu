'use client'

import Link from "next/link";
import Image from "next/image";
import { Unauthenticated } from "convex/react";
import { Authenticated } from "convex/react";
import { UserProfileIcon } from "../auth/UserProfileIcon";
import { Button } from "../ui/button";

export default function ProtectedHeader() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/images/logo/orttu-logo.svg"
            alt="Orttu Logo"
            width={352}
            height={70}
            priority
          />
        </Link>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/guide" className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4">Guide</Link>
            </li>
            <li>
              <Unauthenticated>
                <Button asChild variant="secondary">
                  <Link href="/login">Login</Link>
                </Button>
              </Unauthenticated>
              <Authenticated>
                <UserProfileIcon />
              </Authenticated>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 
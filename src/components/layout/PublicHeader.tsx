'use client'

import Image from "next/image";
import Link from "next/link";
import { UserProfileIcon, UserProfileIconFallback } from "../auth/UserProfileIcon";
import { Suspense } from "react";

export default function PublicHeader() {
    return (
        <header className="w-full border-b">
            {/* h-[48px] to avoid header height jumping on load */}
            <div className="container mx-auto h-[48px] px-4 my-3 flex justify-between items-center">
                <Link href="/">
                    <Image
                        src="/images/logo/orttu-logo.svg"
                        alt="Orttu Logo"
                        width={176}
                        height={45}
                        priority
                    />
                </Link>
                <nav>
                    <ul className="flex items-center gap-4">
                        <li>
                            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900">About</Link>
                        </li>
                        <li>
                            <Link href="/guide" className="text-sm font-medium text-gray-700 hover:text-gray-900">Guide</Link>
                        </li>
                        <li>
                            <Suspense fallback={<UserProfileIconFallback />}>
                                <UserProfileIcon />
                            </Suspense>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
} 
import Link from "next/link";
import Image from "next/image";
import { UserProfileIcon } from "@/components/auth/UserProfileIcon";
import { Button } from "@/components/ui/button";

export default function ProtectedHeader() {
  return (
    <header className="w-full">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
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
              <Button variant="subtle" size="sm">
                <Link href="/guide">Guide</Link>
              </Button>
            </li>
            <li>
              <UserProfileIcon />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 
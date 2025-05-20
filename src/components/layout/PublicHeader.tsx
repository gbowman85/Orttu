import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicHeader() {
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
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900">About</Link>
            </li>
            <li>
              <Link href="/guide" className="text-sm font-medium text-gray-700 hover:text-gray-900">Guide</Link>
            </li>
            <li>
              <Button asChild variant="secondary">
                <Link href="/login">Login</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 
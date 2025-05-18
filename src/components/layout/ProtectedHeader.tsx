import Link from "next/link";
import Image from "next/image";

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
          <ul>
            <li>
              <Link href="/guide" className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4">Guide</Link>
              <Link href="/account" className="text-sm font-medium text-gray-700 hover:text-gray-900">Account</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 
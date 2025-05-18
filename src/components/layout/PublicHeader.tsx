import Image from "next/image";
import Link from "next/link";

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
          <ul>
            <li>
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4">About</Link>
              <Link href="/guide" className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4">Guide</Link>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 
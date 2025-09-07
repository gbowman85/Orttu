import { SignInWithPassword } from '@/components/auth/SignInWithPassword';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <>
      <Link href="/">
        <Image
          src="/images/logo/orttu-logo-square.svg"
          alt="Orttu Logo"
          className="mx-auto mb-8"
          width={150}
          height={118}
        />
      </Link>
      <SignInWithPassword />
    </>
  );
} 
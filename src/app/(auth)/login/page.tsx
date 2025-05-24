import { SignInWithPassword } from '@/components/auth/SignInWithPassword';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <Link href="/">
        <img
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
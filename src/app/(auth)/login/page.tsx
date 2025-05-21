import { SignInWithPassword } from '@/components/auth/SignInWithPassword';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <SignInWithPassword />
    </main>
  );
} 
import ProtectedHeader from "@/components/layout/ProtectedHeader";
import MinimalFooter from "@/components/layout/MinimalFooter";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ProtectedHeader />
      <main className="flex-1 px-4">
        {children}
      </main>
      <MinimalFooter />
    </div>
  );
} 
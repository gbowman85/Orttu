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
      <main className="flex flex-col flex-1">
        {children}
      </main>
      <MinimalFooter />
    </div>
  );
} 
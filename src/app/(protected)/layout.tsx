import ProtectedHeader from "@/components/layout/ProtectedHeader";
import ProtectedFooter from "@/components/layout/ProtectedFooter";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ProtectedHeader />
      <main className="flex-1">
        {children}
      </main>
      <ProtectedFooter />
    </div>
  );
} 
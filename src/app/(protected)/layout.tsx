import ProtectedHeader from "@/components/layout/ProtectedHeader";
import MinimalFooter from "@/components/layout/MinimalFooter";
import { HeaderSlotProvider } from "@/contexts/HeaderSlotContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderSlotProvider>
      <div className="h-screen flex flex-col">
        <ProtectedHeader />
        <main className="flex flex-col flex-1 min-h-0">
          {children}
        </main>
        <MinimalFooter />
      </div>
    </HeaderSlotProvider>
  );
} 
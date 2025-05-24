import PublicFooter from "@/components/layout/PublicFooter";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex flex-1 flex-col items-center p-8 md:p-24">
                <div className="w-full max-w-md">
                    <div className="bg-gray-100 rounded-lg shadow-lg p-8">
                        {children}
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
} 
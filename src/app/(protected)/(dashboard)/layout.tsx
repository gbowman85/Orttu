import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div id="dashboard" className="flex flex-row gap-4">
            <div id="sidebar" className="flex flex-col w-50 pt-4 pl-2">
                {/* New workflow button */}
                <Button className="mb-4">
                    <PlusIcon className="w-4 h-4" />
                    New workflow
                </Button>

                {/* Dashboard navigation */}
                <DashboardNavigation />
            </div>
            {/* Main content */}
            <div className="flex flex-col w-full h-full bg-white rounded-md p-4">
                {children}
            </div>
        </div>
    );
} 
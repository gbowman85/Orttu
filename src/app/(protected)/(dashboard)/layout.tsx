import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import NewWorkflowDialog from "@/components/dashboard/NewWorkflowDialog";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div id="dashboard" className="flex flex-row gap-4">
                <div id="sidebar" className="flex flex-col w-50 pt-4 pl-2">
                    {/* New workflow button */}
                    <NewWorkflowDialog />

                    {/* Dashboard navigation */}
                    <DashboardNavigation />
                </div>
                {/* Main content */}
                <div className="flex flex-col w-full h-full bg-white rounded-md p-4">
                    {children}
                </div>
            </div>



        </>
    );
} 
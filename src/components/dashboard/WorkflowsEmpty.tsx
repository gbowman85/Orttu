import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export function WorkflowsEmpty() {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                You do not have any workflows
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Create one to get started
            </p>
            <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
            </Button>
        </div>
    );
} 
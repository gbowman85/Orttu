'use client'

import { Button } from "@/components/ui/button"
import AddActionButton from "@/components/editor/AddActionButton"
import ActionCard from "@/components/editor/ActionCardx"

export default function WorkflowBuilder() {
    return (
        <div className="flex-1 flex flex-col items-center justify-top min-h-0 mt-4">
            {/* Trigger */}
            <Button className="w-90 h-20 mb-2 p-4 border-4 border-gray-200 border-dashed rounded-3xl text-center text-muted-foreground" variant="outline">
                Choose a trigger
            </Button>

            {/* Actions */}
            <div id="actions-container" className="flex flex-col items-center justify-top min-h-0 gap-2">
                <AddActionButton />
                
                <ActionCard title="Action" description="Description" />
            </div>

        </div>
    )
} 
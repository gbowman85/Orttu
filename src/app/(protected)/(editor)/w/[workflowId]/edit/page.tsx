'use client'
import { DragDropProvider } from '@dnd-kit/react'
import { DragMonitor } from "@/components/editor/DragMonitor"
import EditorSidebar from "@/components/editor/EditorSidebar"
import WorkflowBuilder from "@/components/editor/WorkflowBuilder"
import { WorkflowEditorProvider } from '@/contexts/WorkflowEditorContext'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useWorkflowData } from '@/hooks/useWorkflowData'
import { useWorkflowActions } from '@/hooks/useWorkflowActions'

export default function EditorPage() {
    const {
        workflow,
        workflowConfig,
        triggerStep,
        triggerDefinition,
        actionStepsOrder,
        actionStepsDetails,
        actionDefinitions
    } = useWorkflowData()

    const { handleDragStart, handleDragOver, handleDragEnd } = useWorkflowActions(
        workflowConfig?._id
    )

    return (
        <WorkflowEditorProvider
            workflow={workflow ?? undefined}
            triggerStep={triggerStep ?? undefined}
            triggerDefinition={triggerDefinition ?? undefined}
            actionStepsOrder={actionStepsOrder ?? undefined}
            actionStepsDetails={actionStepsDetails ?? {}}
            actionDefinitions={actionDefinitions}
        >
            <DragDropProvider
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <DragMonitor>
                    <div id="editor-container" className="h-full">
                        <ResizablePanelGroup direction="horizontal" autoSaveId="workflow-editor" className="h-full" style={{ minWidth: '180px' }}>
                            <ResizablePanel defaultSize={15} className="min-w-[180px] max-w-[300px] h-full">
                                <div id="sidebar" className="h-full pt-4 pl-3 pr-1">
                                    <EditorSidebar />
                                </div>
                            </ResizablePanel>

                            <ResizableHandle className="w-2 rounded-sm bg-transparent hover:bg-gray-200 transition-colors" />

                            <ResizablePanel defaultSize={85} className="h-full">
                                <div id="canvas" className="h-full bg-white rounded-md p-4">
                                    <WorkflowBuilder />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </DragMonitor>
            </DragDropProvider>
        </WorkflowEditorProvider>
    )
}
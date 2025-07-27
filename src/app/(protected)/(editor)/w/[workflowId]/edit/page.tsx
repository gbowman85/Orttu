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
            triggerStep={triggerStep ?? undefined}
            triggerDefinition={triggerDefinition ?? undefined}
            actionStepsOrder={actionStepsOrder ?? []}
            actionStepsDetails={actionStepsDetails ?? {}}
            actionDefinitions={actionDefinitions}
        >
            <DragDropProvider 
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <DragMonitor>
                    <div className="flex-1 flex flex-col">
                        <div id="editor-container" className="flex flex-col flex-1 gap-4">
                            <ResizablePanelGroup direction="horizontal" autoSaveId="workflow-editor" className="flex-1" style={{ minWidth: '180px' }}>
                                <ResizablePanel defaultSize={15} className="min-w-[180px] max-w-[300px]">
                                    <div id="sidebar" className="flex flex-col h-full pt-4 pl-3 pr-1 relative min-h-0">
                                        <EditorSidebar />
                                    </div>
                                </ResizablePanel>

                                <ResizableHandle className="w-2 rounded-sm bg-transparent hover:bg-gray-200 transition-colors" />

                                <ResizablePanel defaultSize={85} className="mb-4 mr-4">
                                    <div id="canvas" className="flex flex-col w-full h-full bg-white rounded-md p-4 min-h-0">
                                        <div className="flex flex-col flex-1">
                                            <WorkflowBuilder />
                                        </div>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </div>
                    </div>
                </DragMonitor>
            </DragDropProvider>
        </WorkflowEditorProvider>
    )
}
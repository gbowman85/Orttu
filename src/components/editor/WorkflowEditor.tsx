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
import { Doc, Id } from "@/../convex/_generated/dataModel"
import { ActionStepRefType } from '@/../convex/types'
import {Debug} from '@dnd-kit/dom/plugins/debug'
import {defaultPreset} from '@dnd-kit/dom'

interface WorkflowEditorProps {
    onDragStart: (event: any) => void
    onDragOver: (event: any) => void
    onDragEnd: (event: any) => void
    triggerStep: Doc<"trigger_steps"> | undefined
    triggerDefinition: Doc<"trigger_definitions"> | undefined
    actionStepRefs: ActionStepRefType[] | undefined
    actionSteps: Record<Id<'action_steps'>, Doc<'action_steps'>>
    actionDefinitions: Record<Id<'action_definitions'>, Doc<'action_definitions'>>
}

export function WorkflowEditor({
    onDragStart,
    onDragOver,
    onDragEnd,
    triggerStep,
    triggerDefinition,
    actionStepRefs,
    actionSteps,
    actionDefinitions
}: WorkflowEditorProps) {
    return (
        <WorkflowEditorProvider
            triggerStep={triggerStep}
            triggerDefinition={triggerDefinition}
            actionStepRefs={actionStepRefs}
            actionSteps={actionSteps}
            actionDefinitions={actionDefinitions}
        >
            <DragDropProvider 
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                // plugins={[...defaultPreset.plugins, Debug]}
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
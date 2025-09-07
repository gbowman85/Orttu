'use client'

import WorkflowEditorHeader from "@/components/editor/WorkflowEditorHeader"
import EditorToolbar from "@/components/editor/EditorToolbar"
import { useWorkflowEditor } from "@/contexts/WorkflowEditorContext"
import { WorkflowEditorProvider } from '@/contexts/WorkflowEditorContext'
import { useWorkflowData } from '@/hooks/useWorkflowData'
import ActivityPage from './activity/page'

function EditorContent({ children }: { children: React.ReactNode }) {
    const { currentTab } = useWorkflowEditor()

    return (
        <div id="workflow-editor" className="flex flex-col flex-1 min-h-0">
            <WorkflowEditorHeader />
            <EditorToolbar />
            <div className="flex-1 min-h-0">
                {/* Keep both components mounted, just hide/show based on tab */}
                <div className={`h-full ${currentTab === 'editor' ? 'block' : 'hidden'}`}>
                    {children}
                </div>
                <div className={`h-full ${currentTab === 'activity' ? 'block' : 'hidden'}`}>
                    <ActivityPage />
                </div>
            </div>
        </div>
    )
}

export default function EditorPage({ children }: { children: React.ReactNode }) {
    const {
        workflow,
        triggerStep,
        triggerDefinition,
        actionStepsOrder,
        actionStepsDetails,
        actionDefinitions,
        actionCategories
    } = useWorkflowData()

    return (
        <WorkflowEditorProvider
            workflow={workflow ?? undefined}
            triggerStep={triggerStep ?? undefined}
            triggerDefinition={triggerDefinition ?? undefined}
            actionStepsOrder={actionStepsOrder ?? undefined}
            actionStepsDetails={actionStepsDetails ?? {}}
            actionDefinitions={actionDefinitions}
            actionCategories={actionCategories}
        >
            <EditorContent>
                {children}
            </EditorContent>
        </WorkflowEditorProvider>
    )
}
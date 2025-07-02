import WorkflowEditorHeader from "@/components/editor/WorkflowEditorHeader"
import EditorToolbar from "@/components/editor/EditorToolbar"
import { WorkflowEditorProvider } from "@/contexts/WorkflowEditorContext"

export default function EditorPage({ children }: { children: React.ReactNode }) {
    return (
        <WorkflowEditorProvider>
            <WorkflowEditorHeader />
            <EditorToolbar />
            {children}
        </WorkflowEditorProvider>
    )
}
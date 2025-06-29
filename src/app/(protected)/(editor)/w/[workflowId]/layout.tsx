import WorkflowEditorHeader from "@/components/editor/WorkflowEditorHeader"
import EditorToolbar from "@/components/editor/EditorToolbar"

export default function EditorPage({ children }: { children: React.ReactNode }) {
    return (
        <div id="workflow-editor">
            <WorkflowEditorHeader />
            <EditorToolbar />
            {children}
        </div>
    )
}
import WorkflowEditorHeader from "@/components/editor/WorkflowEditorHeader"
import EditorToolbar from "@/components/editor/EditorToolbar"

export default function EditorPage({ children }: { children: React.ReactNode }) {
    return (
        <div id="workflow-editor" className="flex flex-col flex-1 min-h-0">
            <WorkflowEditorHeader />
            <EditorToolbar />
            {children}
        </div>
    )
}
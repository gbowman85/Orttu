'use client'

import EditorToolbar from "@/components/editor/EditorToolbar"
import WorkflowBuilder from "@/components/editor/WorkflowBuilder"
import PropertiesPanel from "@/components/editor/PropertiesPanel"
import { useHeaderSlot } from "@/contexts/HeaderSlotContext"
import { useEffect, useMemo } from "react"
import WorkflowHeader from "@/components/editor/WorkflowHeader"
import { DragDropProvider } from '@dnd-kit/react'
import EditorSidebar from "@/components/editor/EditorSidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function EditorPage() {
  // Memoize the workflow object
  const workflow = useMemo(() => ({
    title: "Workflow 1",
    description: "Workflow 1 description",
    starred: false,
    tags: ["tag1", "tag2"],
    status: "draft" as const,
    enabled: false,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    id: "1",
    version: 1,
  }), []) 

  const { setSlot, clearSlot } = useHeaderSlot()

  // Memoize the WorkflowHeader component instance
  const headerContent = useMemo(() => (
    <WorkflowHeader {...workflow} />
  ), [workflow])

  // Set up the header content
  useEffect(() => {
    setSlot('afterLogo', headerContent)
    return () => clearSlot('afterLogo')
  }, [setSlot, clearSlot, headerContent])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      // The drop was successful
      console.log('Dropped:', active.id, 'onto:', over.id)
    }
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex-1 flex flex-col">
        <div id="editor-container" className="flex flex-col flex-1 gap-4">
          <ResizablePanelGroup direction="horizontal" autoSaveId="workflow-editor" className="flex-1" style={{ minWidth: '180px' }}>
            {/* Editor Sidebar */}
            <ResizablePanel defaultSize={15} className="min-w-[180px] max-w-[300px]">
              <div
                id="sidebar"
                className="flex flex-col h-full pt-4 pl-3 pr-1 relative min-h-0"
              >
                <EditorSidebar />
              </div>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle className="w-2 rounded-sm bg-transparent hover:bg-gray-200 transition-colors" />

            {/* Workflow Canvas */}
            <ResizablePanel defaultSize={85} className="mb-4 mr-4">
              <div id="canvas" className="flex flex-col w-full h-full bg-white rounded-md p-4 min-h-0">
                <div className="flex flex-col flex-1">
                  {/* Editor Toolbar */}
                  <EditorToolbar />

                  {/* Workflow Builder and Properties Panel */}
                  <div className="flex flex-1 min-h-0">
                    <WorkflowBuilder />
                    <PropertiesPanel />
                  </div>

                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </DragDropProvider>
  )
}
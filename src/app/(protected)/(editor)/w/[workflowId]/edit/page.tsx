'use client'

import EditorToolbar from "@/components/editor/EditorToolbar"
import WorkflowBuilder from "@/components/editor/WorkflowBuilder"
import PropertiesPanel from "@/components/editor/PropertiesPanel"
import { useHeaderSlot } from "@/contexts/HeaderSlotContext"
import { useEffect, useMemo } from "react"
import WorkflowHeader from "@/components/editor/WorkflowHeader"

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
  }), []) // Empty deps since this is demo data

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

  return (
    <div className="flex flex-col flex-1">
      <EditorToolbar />
      <div className="flex flex-1 min-h-0">
        <WorkflowBuilder />
        <PropertiesPanel />
      </div>
    </div>
  )
}
import { useEffect, useMemo } from "react"
import { useHeaderSlot } from "@/contexts/HeaderSlotContext"
import WorkflowHeader from "@/components/editor/WorkflowHeader"
import { Doc } from "@/../convex/_generated/dataModel"

export function WorkflowEditorHeader({ workflow }: { workflow: Doc<"workflows"> | undefined }) {
  const { setSlot, clearSlot } = useHeaderSlot()

  const headerContent = useMemo(() => (
    <WorkflowHeader workflow={workflow as Doc<"workflows">} />
  ), [workflow])

  useEffect(() => {
    setSlot('afterLogo', headerContent)
    return () => clearSlot('afterLogo')
  }, [setSlot, clearSlot, headerContent])

  return null
} 
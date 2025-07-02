'use client'

import { useEffect, useMemo } from "react"
import { useHeaderSlot } from "@/contexts/HeaderSlotContext"
import WorkflowHeader from "@/components/editor/WorkflowHeader"
import { Doc } from "@/../convex/_generated/dataModel"
import { useWorkflowEditor } from "@/contexts/WorkflowEditorContext"

export default function WorkflowEditorHeader() {
    const { workflow } = useWorkflowEditor()
    const { setSlot, clearSlot } = useHeaderSlot()

    const headerContent = useMemo(() => (
        workflow ? <WorkflowHeader workflow={workflow as Doc<"workflows">} /> : null
    ), [workflow])

    useEffect(() => {
        if (headerContent) {
            setSlot('afterLogo', headerContent)
        }
        return () => clearSlot('afterLogo')
    }, [setSlot, clearSlot, headerContent])

    return null
} 
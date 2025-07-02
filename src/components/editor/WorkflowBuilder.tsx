'use client'

import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { TriggerCard } from "@/components/editor/TriggerCard"
import { ActionStepCard } from "@/components/editor/ActionStepCard"
import { ActionTarget } from "@/components/editor/ActionTarget"
import PropertiesPanel from "@/components/editor/PropertiesPanel"
import { useDragState } from '@/components/editor/DragMonitor'
import { ActionStepRefType } from '@/../convex/types'
import React, { useRef, useLayoutEffect } from 'react'

function arrayMove(array: ActionStepRefType[], from: number, to: number) {
  const arr = array.slice()
  const [item] = arr.splice(from, 1)
  arr.splice(to, 0, item)
  return arr
}

export default function WorkflowBuilder() {
    const {
        triggerStep,
        triggerDefinition,
        actionStepRefs,
        actionSteps,
        actionDefinitions,
        setSelectedStepId,
        selectedStepId
    } = useWorkflowEditor()
    const { draggedActionStepId, dropTargetParentId, dropTargetParentKey, dropTargetIndex } = useDragState()
    let refsToRender = actionStepRefs
    if (
      draggedActionStepId &&
      dropTargetIndex !== null &&
      dropTargetParentId === 'root' &&
      actionStepRefs
    ) {
      const from = actionStepRefs.findIndex(ref => ref.actionStepId === draggedActionStepId)
      if (from !== -1) {
        refsToRender = arrayMove(actionStepRefs, from, dropTargetIndex)
      }
    }

    // Store refs for each card
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
    // Store previous positions
    const prevRects = useRef<Record<string, DOMRect>>({})

    // FLIP animation effect for root-level ActionStepCards
    useLayoutEffect(() => {
      const newRects: Record<string, DOMRect> = {}
      ;(refsToRender ?? []).forEach(step => {
        const el = cardRefs.current[step.actionStepId as string]
        if (el) {
          newRects[step.actionStepId as string] = el.getBoundingClientRect()
        }
      })
      ;(refsToRender ?? []).forEach(step => {
        const el = cardRefs.current[step.actionStepId as string]
        const prev = prevRects.current[step.actionStepId as string]
        const next = newRects[step.actionStepId as string]
        if (el && prev && next) {
          const dx = prev.left - next.left
          const dy = prev.top - next.top
          if (dx !== 0 || dy !== 0) {
            el.style.transform = `translate(${dx}px, ${dy}px)`
            el.style.transition = 'transform 0s'
            requestAnimationFrame(() => {
              el.style.transform = ''
              el.style.transition = 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)'
            })
          }
        }
      })
      prevRects.current = newRects
    }, [(refsToRender ?? []).map(r => r.actionStepId).join(',')])

    return (
        <div className="relative flex flex-row flex-1">
            <div 
                id="workflow-builder-container"
                className="w-full "
                onClick={(e) => {
                    if (selectedStepId && (e.target === e.currentTarget || (e.target as HTMLElement).parentElement === e.currentTarget)) {
                        setSelectedStepId(null)
                    }
                }}>
                <div
                    id="workflow-builder"
                    className="flex flex-col w-fit items-center justify-top min-h-0 mt-4"

                >
                    <TriggerCard
                        triggerStep={triggerStep}
                        triggerDefinition={triggerDefinition}
                    />

                    <div id="actions-container" className="flex flex-col items-center justify-top min-h-0 mt-2 gap-2">
                        {(refsToRender ?? []).map((step, index) => {
                            const isHidden = draggedActionStepId === step.actionStepId
                            const actionStep = actionSteps[step.actionStepId]
                            if (!actionStep) return null
                            return (
                                <ActionStepCard
                                    key={step.actionStepId}
                                    ref={(el: HTMLDivElement | null) => { cardRefs.current[step.actionStepId as string] = el }}
                                    actionStep={actionStep}
                                    actionDefinition={actionDefinitions[actionStep.actionDefinitionId] ?? {}}
                                    index={index}
                                    parentId='root'
                                    disableDroppable={false}
                                    isHidden={isHidden}
                                />
                            )
                        })}
                        {actionStepRefs !== undefined && actionStepRefs.length === 0 && (
                            <ActionTarget id="root-initial-action" index={0} parentId="root" parentKey={undefined} disableDroppable={false} />
                        )}
                    </div>
                </div>
            </div>
            <div id="properties-panel" className="absolute top-0 right-0">
                <PropertiesPanel />
            </div>
        </div>
    )
} 
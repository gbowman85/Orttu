'use client'

import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { TriggerCard } from "@/components/editor/TriggerCard"
import { ActionStepCard } from "@/components/editor/ActionStepCard"
import { ActionTarget } from "@/components/editor/ActionTarget"
import PropertiesPanel from "@/components/editor/PropertiesPanel"
import { AddActionButton } from './AddActionButton'
import { DeleteStepDialog } from './DeleteStepDialog'
import { DataPopup } from './DataPopup'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { useWorkflowData } from '@/hooks/useWorkflowData'
import { useState } from 'react'
import { ActionsSkeleton } from './LoadingStates'
import { Button } from '../ui/button'
import { DatabaseIcon } from 'lucide-react'

export default function WorkflowBuilder() {
    const {
        triggerStep,
        triggerDefinition,
        actionStepsOrder,
        actionStepsDetails,
        actionDefinitions,
        actionCategories,
        setSelectedStepId,
        selectedStepId,
        deleteDialogState,
        closeDeleteDialog
    } = useWorkflowEditor()

    const { workflowConfig } = useWorkflowData()
    const removeActionStep = useMutation(api.data_functions.workflow_steps.removeActionStep)
    const removeTrigger = useMutation(api.data_functions.workflow_steps.removeTrigger)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDataPopupOpen, setIsDataPopupOpen] = useState(false)

    const [actionsContainerRef] = useAutoAnimate()

    const handleConfirmDelete = async () => {
        if (!workflowConfig?._id) return

        setIsDeleting(true)
        try {
            if (deleteDialogState.type === 'trigger') {
                console.log('Removing trigger')
                await removeTrigger({
                    workflowConfigId: workflowConfig._id
                })
            } else if (deleteDialogState.type === 'action-step' && deleteDialogState.actionStepId && deleteDialogState.parentId) {
                console.log('Removing action step')
                await removeActionStep({
                    workflowConfigId: workflowConfig._id,
                    actionStepId: deleteDialogState.actionStepId,
                    parentId: deleteDialogState.parentId,
                    parentKey: deleteDialogState.parentKey || undefined
                })
            }
            closeDeleteDialog()
        } catch (error) {
            console.error('Failed to remove item:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="relative flex flex-row h-full">
            <div
                id="workflow-builder-container"
                className="w-full h-full overflow-y-auto"
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

                    {/* If actionStepsOrder is undefined, show a loading state */}
                    {actionStepsOrder === undefined && (
                        <ActionsSkeleton />
                    )}

                    <div
                        id="actions-container"
                        ref={actionsContainerRef}
                        className="flex flex-col items-center justify-top min-h-0 mt-2 gap-2"
                    >


                        {actionStepsOrder !== undefined && actionStepsOrder.length === 0 && (
                            <ActionTarget id="root-initial-action" index={0} parentId="root" parentKey={undefined} disableDroppable={false} />
                        )}
                        {actionStepsOrder !== undefined && actionStepsOrder.length > 0 && (
                            <AddActionButton index={0} parentId='root' disableDroppable={false} isDragging={false} />
                        )}

                        {actionStepsOrder?.map((step, index) => {
                            const actionStep = actionStepsDetails[step.actionStepId]
                            if (!actionStep) return null

                            // const uniqeId = 'root-' + step.actionStepId
                            return (
                                <ActionStepCard
                                    key={step.actionStepId}
                                    id={step.actionStepId}
                                    actionStep={actionStep}
                                    actionDefinition={actionDefinitions[actionStep.actionDefinitionId] ?? {}}
                                    actionCategories={actionCategories}
                                    index={index}
                                    parentId='root'
                                    disableDroppable={false}
                                />
                            )
                        })}

                    </div>
                </div>
            </div>
            <div id="properties-panel" className="absolute top-0 right-0">
                <div className="flex justify-end mb-2 ">
                    <DataPopup />
                </div>
                <PropertiesPanel />
            </div>

            {/* Delete Trigger or Action Step Dialog */}
            <DeleteStepDialog
                isOpen={deleteDialogState.isOpen}
                onClose={closeDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemTitle={deleteDialogState.itemTitle}
                itemType={deleteDialogState.type || 'action-step'}
                isDeleting={isDeleting}
            />
        </div>
    )
} 
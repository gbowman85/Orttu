'use client'

import { useCallback } from 'react'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Doc, Id } from '@/../convex/_generated/dataModel'
import { ParameterForm } from './ParameterForm'
import { useWorkflowData } from '@/hooks/useWorkflowData'
import { EditableText } from '@/components/ui/editable-text'
import { useStepActions } from '@/hooks/useStepActions'
import { PipedreamPropsForm } from './PipedreamPropsForm'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PropertiesPanel() {
    const { selectedStepId, triggerStep, triggerDefinition, actionStepsDetails, actionDefinitions, setSelectedStepId } = useWorkflowEditor()
    const { workflowConfig } = useWorkflowData()
    const { handleEditStepTitle, handleEditStepComment } = useStepActions()
    const selectedStep = triggerStep?._id === selectedStepId ? triggerStep : selectedStepId && actionStepsDetails[selectedStepId as Id<'action_steps'>]
    const selectedDefinition = triggerStep?._id === selectedStepId ? triggerDefinition : selectedStep && 'actionDefinitionId' in selectedStep ? actionDefinitions[selectedStep.actionDefinitionId] : null

    // Get the parameter values for the selected step
    const parameterValues = useQuery(
        api.data_functions.workflow_steps.getStepParameterValues,
        selectedStepId ? {
            stepId: selectedStepId
        } : "skip"
    )

    // Memoize the onSave handlers to prevent unnecessary re-renders
    const handleSaveTitle = useCallback(async (newTitle: string) => {
        if (!workflowConfig || !selectedStepId) return
        await handleEditStepTitle(
            workflowConfig.workflowId,
            selectedStepId,
            newTitle
        )
    }, [workflowConfig, selectedStepId, handleEditStepTitle])

    const handleSaveComment = useCallback(async (newComment: string) => {
        if (!workflowConfig || !selectedStepId) return
        await handleEditStepComment(
            workflowConfig.workflowId,
            selectedStepId,
            newComment
        )
    }, [workflowConfig, selectedStepId, handleEditStepComment])



    return (
        <div id="properties-panel" className="w-80 bg-gray-100 mt-4 ml-4 p-4 rounded-lg shadow-md lg:opacity-100 opacity-80 hover:opacity-100 transition-opacity max-h-[calc(100vh-250px)] flex flex-col">
            {selectedStep && selectedDefinition && workflowConfig && selectedStepId ? (
                <>
                    <div id="properties-header" className="flex flex-col flex-1 min-h-0">
                        <div className="flex-shrink-0 space-y-4">
                            {/* Header with X button */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Title */}
                                    <EditableText
                                        value={selectedStep.title || ''}
                                        fallbackValue={selectedDefinition.title}
                                        placeholder="Enter a title"
                                        elementType="h2"
                                        className="font-semibold mb-1"
                                        inputClassName="font-semibold mb-1"
                                        onSave={handleSaveTitle}
                                    />
                                    {selectedStep.title && (
                                        <div className="text-sm text-muted-foreground">{selectedDefinition.title}</div>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                                    onClick={() => setSelectedStepId(null)}
                                    aria-label="Close properties panel"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* User comment */}
                            <EditableText
                                value={selectedStep.comment || ''}
                                fallbackValue={'Add a comment'}
                                elementType="div"
                                className="text-sm text-muted-foreground mb-2"
                                inputClassName="text-sm text-muted-foreground mb-2"
                                onSave={handleSaveComment}
                                longText={true}
                            />

                            <div className="h-px mb-2 bg-gray-300" />
                        </div>

                        {/* Parameters for Pipedream or standard */}
                        {selectedDefinition?.isPipedream ? (
                            <div className="flex-1 min-h-0 flex flex-col">
                                <PipedreamPropsForm
                                    workflowConfigId={workflowConfig._id}
                                    step={selectedStep as Doc<'action_steps'>}
                                    actionDefinition={selectedDefinition as Doc<'action_definitions'>}
                                />
                            </div>
                        ) : (
                            <>
                                {selectedDefinition.parameters.length > 0 && (
                                    <div className="flex-1 min-h-0">
                                        <ParameterForm
                                            parameters={selectedDefinition.parameters}
                                            initialValues={parameterValues || {}}
                                            stepId={selectedStepId}
                                            workflowConfigId={workflowConfig._id}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </>
            ) : (
                <>
                    <div className="text-sm text-muted-foreground">
                        Select an action to view the properties
                    </div>
                </>
            )}
        </div>
    )
} 
'use client'

import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Id } from '@/../convex/_generated/dataModel'
import { ParameterForm } from './ParameterForm'
import { useWorkflowData } from '@/hooks/useWorkflowData'
import { EditableText } from '@/components/ui/editable-text'
import { useStepActions } from '@/hooks/useStepActions'
import { PipedreamPropsForm } from './PipedreamPropsForm'

export default function PropertiesPanel() {
    const { selectedStepId, triggerStep, triggerDefinition, actionStepsDetails, actionDefinitions } = useWorkflowEditor()
    const { workflowConfig } = useWorkflowData()
    const { handleEditStepTitle, handleEditStepComment } = useStepActions()
    const selectedStep = triggerStep?._id === selectedStepId ? triggerStep : selectedStepId && actionStepsDetails[selectedStepId as Id<'action_steps'>]
    const selectedDefinition = triggerStep?._id === selectedStepId ? triggerDefinition : selectedStep && 'actionDefinitionId' in selectedStep ? actionDefinitions[selectedStep.actionDefinitionId] : null
    const selectedKey = selectedStepId ? (triggerStep?._id === selectedStepId ? triggerDefinition?.serviceId || '' : selectedStep && 'actionDefinitionId' in selectedStep ? actionDefinitions[selectedStep.actionDefinitionId].actionKey : '') : null

    // Get the parameter values for the selected step
    const parameterValues = useQuery(
        api.data_functions.workflow_steps.getStepParameterValues,
        selectedStepId ? {
            stepId: selectedStepId
        } : "skip"
    )

    // Get the current userId
    const user = useQuery(api.data_functions.users.currentUser)
    const userId = user?._id || ''
    

    return (
        <div className="w-80 bg-gray-100 mt-4 ml-4 p-4 rounded-lg shadow-md lg:opacity-100 opacity-80 hover:opacity-100 transition-opacity">
            {selectedStep && selectedDefinition && workflowConfig && selectedStepId ? (
                <>
                    <div className="space-y-4">
                        {/* Title */}
                        <EditableText
                            value={selectedStep.title || ''}
                            fallbackValue={selectedDefinition.title}
                            placeholder="Enter a title"
                            elementType="h2"
                            className="font-semibold mb-1"
                            inputClassName="font-semibold mb-1"
                            onSave={async (newTitle) => {
                                await handleEditStepTitle(
                                    workflowConfig.workflowId,
                                    selectedStepId,
                                    newTitle
                                )
                            }}
                        />
                        {selectedStep.title && (
                            <div className="text-sm text-muted-foreground">{selectedDefinition.title}</div>
                        )}

                        {/* User comment */}
                        <EditableText
                            value={selectedStep.comment || ''}
                            fallbackValue={'Add a comment'}
                            elementType="div"
                            className="text-sm text-muted-foreground mb-2"
                            inputClassName="text-sm text-muted-foreground mb-2"
                            onSave={async (newComment) => {
                                await handleEditStepComment(
                                    workflowConfig.workflowId,
                                    selectedStepId,
                                    newComment
                                )
                            }}
                            longText={true}
                        />

                        <div className="h-px mb-2 bg-gray-300" />

                        {/* Parameters */}
                        {!selectedDefinition?.isPipedream ? (
                            <>
                                {selectedDefinition.parameters.length > 0 && (
                                    <div>
                                        <ParameterForm
                                            parameters={selectedDefinition.parameters}
                                            initialValues={parameterValues || {}}
                                            stepId={selectedStepId}
                                            workflowConfigId={workflowConfig._id}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div>
                                <PipedreamPropsForm
                                    configurableProps={selectedDefinition.configurableProps || []}
                                    initialValues={parameterValues || {}}
                                    stepId={selectedStepId}
                                    workflowConfigId={workflowConfig._id}
                                />
                            </div>
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
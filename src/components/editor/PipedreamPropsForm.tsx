'use client'

import { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { PipedreamConfigurableProp } from '@/../convex/types'
import { PipedreamPropInput } from '@/components/editor/PipedreamPropInput'
import { PropertiesConnection } from '@/components/editor/PropertiesConnection'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Id, Doc } from '@/../convex/_generated/dataModel'
import { z } from 'zod/v4'
import { usePipedreamProps } from '@/hooks/usePipedream'

// Create a Zod schema from a configurable prop
function createPropSchema(prop: PipedreamConfigurableProp) {
    // Don't validate hidden, disabled, or app type props
    if (prop.hidden || prop.disabled || prop.type === 'app') {
        return z.any().optional()
    }

    let schema: z.ZodTypeAny
    const isRequired = !prop.optional

    // Schema based on type
    switch (prop.type) {
        case 'string':
        case 'text':
            if (isRequired) {
                schema = z.string({
                    error: 'You must enter some text'
                })
            } else {
                // For optional fields, allow empty string, null, or undefined
                schema = z.string().optional().or(z.literal('')).or(z.null()).or(z.undefined())
            }
            break
        case 'number':
            if (isRequired) {
                schema = z.number({
                    error: 'You must enter a number'
                })
            } else {
                // For optional fields, allow null, undefined, or valid number
                schema = z.number().optional().or(z.null()).or(z.undefined())
            }
            break
        case 'boolean':
            schema = z.boolean()
            break
        case 'date':
        case 'datetime':
            if (isRequired) {
                schema = z.number({ error: 'You must enter a date' })
            } else {
                // For optional fields, allow null, undefined, or valid timestamp
                schema = z.number().optional().or(z.null()).or(z.undefined())
            }
            break
        case 'array':
            if (isRequired) {
                schema = z.array(z.string({
                    error: 'You must provide an array'
                }))
            } else {
                // For optional fields, allow null, undefined, or valid array
                schema = z.array(z.string()).optional().or(z.null()).or(z.undefined())
            }
            break
        case 'object':
            if (isRequired) {
                schema = z.record(z.string(), z.any()).refine(
                    (val) => val !== null && val !== undefined,
                    'You must provide an object'
                )
            } else {
                // For optional fields, allow null, undefined, or valid object
                schema = z.record(z.string(), z.any()).optional().or(z.null()).or(z.undefined())
            }
            break
        case 'file':
        case 'image':
            if (isRequired) {
                schema = z.instanceof(File).refine(
                    (val) => val !== null && val !== undefined,
                    'You must provide a file'
                )
            } else {
                // For optional fields, allow null, undefined, or valid file
                schema = z.instanceof(File).optional().or(z.null()).or(z.undefined())
            }
            break
        case 'dir':
            // Directory props are typically handled by Pipedream internally
            schema = z.any().optional()
            break
        default:
            schema = z.any()
    }

    return schema
}

// Create a form schema from configurable props array
function createFormSchema(props: PipedreamConfigurableProp[]) {
    const schemaObject: Record<string, z.ZodTypeAny> = {}

    props.forEach(prop => {
        schemaObject[prop.name] = createPropSchema(prop)
    })

    return z.object(schemaObject)
}

interface PipedreamPropsFormProps {
    workflowConfigId: Id<'workflow_configurations'>
    actionDefinition?: Doc<'action_definitions'>
    step?: Doc<"action_steps">
}

export function PipedreamPropsForm({
    workflowConfigId,
    actionDefinition,
    step,
}: PipedreamPropsFormProps) {

    // Use the Pipedream props hook
    const {
        configuredProps,
        updateConfiguredProps,
        remoteOptions,
        reloadProps,
    } = usePipedreamProps({
        step,
        workflowConfigId,
        actionDefinition
    })

    const configurableProps = actionDefinition?.configurableProps || []

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [hasChanged, setHasChanged] = useState(false)

    const saveStepParameters = useMutation(api.data_functions.workflow_steps.editStepParameterValues)

    useEffect(() => {
        setErrors({})
        setHasChanged(false)
    }, [step?.parameterValues, actionDefinition?.configurableProps])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setErrors({})
            setHasChanged(false)
        }
    }, [])

    const validateForm = (values: Record<string, unknown>) => {
        const formSchema = createFormSchema(configurableProps)
        const result = formSchema.safeParse(values)

        if (result.success) {
            return { isValid: true, errors: {} }
        }

        const newErrors: Record<string, string> = {}
        result.error.issues.forEach((issue) => {
            const path = issue.path[0]
            if (typeof path === 'string') {
                newErrors[path] = issue.message
            }
        })
        return { isValid: false, errors: newErrors }
    }

    const handleChange = async (propName: string, value: unknown) => {
        setHasChanged(true)

        // Update configured props for Pipedream API calls
        updateConfiguredProps({ [propName]: value })

        // Validate only the changed input
        const prop = configurableProps.find(p => p.name === propName)
        if (prop) {
            const schema = createPropSchema(prop)
            const result = schema.safeParse(value)

            if (result.success) {
                // Clear error for this field if validation passes
                setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors[propName]
                    return newErrors
                })
            } else {
                setErrors(prev => ({
                    ...prev,
                    [propName]: result.error.issues[0].message
                }))
            }
        }

        // Handle reloadProps if needed
        if (prop?.reloadProps) {
            console.log('🔄 Property has reloadProps flag - triggering reload for:', propName)
            try {
                await reloadProps(propName)
            } catch (error) {
                console.error('❌ Failed to reload props:', error)
                toast.error('Failed to reload component properties')
            }
        }
    }

    const handleSubmit = async () => {
        // Get all current values from configured props
        const currentValues = configurableProps.reduce((acc, prop) => {
            acc[prop.name] = configuredProps[prop.name] ?? null
            return acc
        }, {} as Record<string, unknown>)

        // Validate all inputs before submitting
        const { isValid: formIsValid, errors: newErrors } = validateForm(currentValues)

        if (!formIsValid) {
            setErrors(newErrors)
            return
        }

        try {
            if (!step?._id) {
                throw new Error('Step not found')
            }
            await saveStepParameters({
                workflowConfigId,
                stepId: step?._id,
                parameterValues: currentValues
            })
            setHasChanged(false)
            toast.success('Properties saved successfully')
        } catch (error) {
            toast.error('Failed to save properties')
            console.error('Failed to save properties:', error)
        }
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <>
            {/* Connection Display */}
            {actionDefinition && (
                <div className="mb-4">
                    <PropertiesConnection
                        workflowConfigId={workflowConfigId}
                        step={step as Doc<'action_steps'>}
                        actionDefinition={actionDefinition}
                        configuredProps={configuredProps}
                        updateConfiguredProps={updateConfiguredProps}
                        onConnectionSelected={() => {

                            //Save the step parameters
                            if (step?._id) {
                                saveStepParameters({
                                    workflowConfigId,
                                    stepId: step?._id,
                                    parameterValues: configuredProps
                                })
                            }

                            // Refresh the form when connection changes
                            setErrors({})
                            setHasChanged(false)
                        }}
                    />
                </div>
            )}

            {/* Show PipedreamPropInputs if there's a connection */}
            {step?.connectionId && (
                <div id="pipedream-properties-form" className="flex-1 min-h-0 overflow-y-auto space-y-4">
                    {configurableProps.map(prop => (
                        <PipedreamPropInput
                            key={prop.name}
                            prop={prop}
                            value={configuredProps[prop.name] ?? null}
                            onChange={(value) => handleChange(prop.name, value)}
                            error={errors[prop.name]}
                            options={remoteOptions[prop.name] || []}
                        />
                    ))}
                </div>
            )}
            {hasChanged && step?.connectionId && (
                <Button
                    onClick={handleSubmit}
                    className="w-full mt-4 sticky bottom-0"
                    disabled={!isValid}
                >
                    Save Changes
                </Button>
            )}
        </>
    )
}

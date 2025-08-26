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

// Create a Zod schema from a configurable prop
function createPropSchema(prop: PipedreamConfigurableProp) {
    // Don't validate hidden, disabled, or app type props
    if (prop.hidden || prop.disabled || prop.type === 'app') {
        return z.any().optional()
    }

    let schema: z.ZodTypeAny

    // Schema based on type
    switch (prop.type) {
        case 'string':
        case 'text':
            schema = z.string({
                error: 'You must enter some text'
            })
            break
        case 'number':
            schema = z.number({
                error: 'You must enter a number'
            })
            break
        case 'boolean':
            schema = z.boolean()
            break
        case 'date':
        case 'datetime':
            schema = z.number({ error: 'You must enter a date' })
            break
        case 'array':
            schema = z.array(z.string({
                error: 'You must provide an array'
            }))
            break
        case 'object':
            schema = z.record(z.string(), z.any()).refine(
                (val) => val !== null && val !== undefined,
                'You must provide an object'
            )
            break
        case 'file':
        case 'image':
            schema = z.instanceof(File).refine(
                (val) => val !== null && val !== undefined,
                'You must provide a file'
            )
            break
        case 'dir':
            // Directory props are typically handled by Pipedream internally
            schema = z.any().optional()
            break
        default:
            schema = z.any()
    }

    // Make optional if the prop is optional
    if (prop.optional) {
        schema = schema.optional()
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
    configurableProps: PipedreamConfigurableProp[]
    initialValues: Record<string, any>
    stepId: Id<'trigger_steps'> | Id<'action_steps'>
    workflowConfigId: Id<'workflow_configurations'>
    actionDefinitionId?: Id<'action_definitions'>
    selectedStep?: Doc<"action_steps">
    onSave?: () => void
    onReloadProps?: (propName: string) => Promise<void>
    remoteOptions?: Record<string, Array<{ label: string; value: any }>>
}

export function PipedreamPropsForm({
    configurableProps,
    initialValues,
    stepId,
    workflowConfigId,
    actionDefinitionId,
    selectedStep,
    onSave,
    onReloadProps,
    remoteOptions = {}
}: PipedreamPropsFormProps) {
    // Initialize values with defaults
    const initialFormValues = configurableProps.reduce((acc, prop) => {
        acc[prop.name] = initialValues[prop.name] ?? null
        return acc
    }, {} as Record<string, any>)

    const [values, setValues] = useState<Record<string, any>>(initialFormValues)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [hasChanged, setHasChanged] = useState(false)
    const [loadingProps, setLoadingProps] = useState<Set<string>>(new Set())

    const editStepParameters = useMutation(api.data_functions.workflow_steps.editStepParameterValues)

    useEffect(() => {
        setValues(initialFormValues)
        setErrors({})
        setHasChanged(false)
    }, [initialValues, configurableProps])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setValues({})
            setErrors({})
            setHasChanged(false)
        }
    }, [])

    const validateForm = (values: Record<string, any>) => {
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

    const handleChange = async (propName: string, value: any) => {
        const newValues = { ...values, [propName]: value }
        setValues(newValues)
        setHasChanged(true)

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
        if (prop?.reloadProps && onReloadProps) {
            setLoadingProps(prev => new Set(prev).add(propName))
            try {
                await onReloadProps(propName)
            } catch (error) {
                console.error('Failed to reload props:', error)
                toast.error('Failed to reload component properties')
            } finally {
                setLoadingProps(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(propName)
                    return newSet
                })
            }
        }
    }

    const handleSubmit = async () => {
        // Validate all inputs before submitting
        const { isValid: formIsValid, errors: newErrors } = validateForm(values)

        if (!formIsValid) {
            setErrors(newErrors)
            return
        }

        try {
            await editStepParameters({
                workflowConfigId,
                stepId,
                parameterValues: values
            })
            setHasChanged(false)
            toast.success('Properties saved successfully')
            onSave?.()
        } catch (error) {
            toast.error('Failed to save properties')
            console.error('Failed to save properties:', error)
        }
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <>
            {/* Connection Display */}
            {actionDefinitionId && (
                <div className="mb-4">
                    <PropertiesConnection
                        actionDefinitionId={actionDefinitionId}
                        stepId={stepId as Id<'action_steps'>}
                        workflowConfigId={workflowConfigId}
                        onConnectionSelected={() => {
                            // Refresh the form when connection changes
                            setValues(initialFormValues)
                            setErrors({})
                            setHasChanged(false)
                        }}
                    />
                </div>
            )}

            {/* Show PipedreamPropInputs if there's a connection */}
            {selectedStep?.connectionId && (
                <div id="pipedream-properties-form" className="flex-1 min-h-0 overflow-y-auto space-y-4">
                    {configurableProps.map(prop => (
                        <PipedreamPropInput
                            key={prop.name}
                            prop={prop}
                            value={values[prop.name]}
                            onChange={(value) => handleChange(prop.name, value)}
                            error={errors[prop.name]}
                            options={remoteOptions[prop.name] || []}
                        />
                    ))}
                </div>
            )}
            {hasChanged && selectedStep?.connectionId && (
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

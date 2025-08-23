'use client'

import { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Parameter } from '@/../convex/types'
import { ParameterInput } from './ParameterInput'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Id } from '@/../convex/_generated/dataModel'
import { z } from 'zod/v4'

// Check if a parameter should be visible based on its showIf condition and current values
function isParameterVisible(parameter: Parameter, values: Record<string, any>): boolean {
    if (!parameter.showIf) return true

    const { parameterKey, operator, value: conditionValue } = parameter.showIf
    const compareValue = values[parameterKey]

    switch (operator) {
        case 'equals':
            return compareValue === conditionValue
        case 'notEquals':
            return compareValue !== conditionValue
        case 'greaterThan':
            return compareValue > conditionValue
        case 'lessThan':
            return compareValue < conditionValue
        case 'contains':
            return Array.isArray(compareValue) && compareValue.includes(conditionValue)
        case 'notContains':
            return Array.isArray(compareValue) && !compareValue.includes(conditionValue)
        default:
            return false
    }
}

// Create a Zod schema from a parameter
function createParameterSchema(parameter: Parameter, isVisible: boolean) {
    // If the field is hidden, make it optional with no validation
    if (!isVisible) {
        return z.any().optional()
    }

    let schema: z.ZodTypeAny

    // Schema based on dataType
    switch (parameter.dataType) {
        case 'string':
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
            schema = z.number({ error: 'You must enter a date' })
            break
        case 'datetime':
            schema = z.number({ error: 'You must enter a date and time' })
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
        default:
            schema = z.any()
    }

    // Add validation rules if they exist
    if (parameter.validation) {
        if (parameter.dataType === 'string') {
            // Cast the schema to a ZodString
            let stringSchema = schema as z.ZodString

            // Add validation rules for string parameters
            if (parameter.validation.minLength) {
                stringSchema = stringSchema.min(parameter.validation.minLength, {
                    error: `Must be at least ${parameter.validation.minLength} characters`
                })
            }
            if (parameter.validation.maxLength) {
                stringSchema = stringSchema.max(parameter.validation.maxLength, {
                    error: `Must be at most ${parameter.validation.maxLength} characters`
                })
            }
            if (parameter.validation.pattern) {
                stringSchema = stringSchema.regex(new RegExp(parameter.validation.pattern), {
                    error: 'Invalid characters'
                })
            }
            if (parameter.validation.allowedValues) {
                stringSchema = stringSchema.refine(
                    (val) => parameter.validation?.allowedValues?.includes(val),
                    'Value is not allowed'
                )
            }
            schema = stringSchema
        }

        // Add validation rules for number parameters
        if (parameter.dataType === 'number') {
            let numberSchema = schema as z.ZodNumber
            if (parameter.validation.min !== undefined) {
                numberSchema = numberSchema.min(parameter.validation.min, {
                    error: `Must be at least ${parameter.validation.min}`
                })
            }
            if (parameter.validation.max !== undefined) {
                numberSchema = numberSchema.max(parameter.validation.max, {
                    error: `Must be at most ${parameter.validation.max}`
                })
            }
            schema = numberSchema
        }
    }

    if (!parameter.required) {
        schema = schema.optional()
    }

    return schema
}

// Create a form schema from parameters array
function createFormSchema(parameters: Parameter[], values: Record<string, any>) {
    const schemaObject: Record<string, z.ZodTypeAny> = {}

    parameters.forEach(parameter => {
        const isVisible = isParameterVisible(parameter, values)
        schemaObject[parameter.parameterKey] = createParameterSchema(parameter, isVisible)
    })

    return z.object(schemaObject)
}

interface ParameterFormProps {
    parameters: Parameter[]
    initialValues: Record<string, any>
    stepId: Id<'trigger_steps'> | Id<'action_steps'>
    workflowConfigId: Id<'workflow_configurations'>
    onSave?: () => void
}

// Show the form for the parameters
export function ParameterForm({
    parameters,
    initialValues,
    stepId,
    workflowConfigId,
    onSave
}: ParameterFormProps) {
    // Initialize values with defaults
    const initialFormValues = parameters.reduce((acc, param) => {
        acc[param.parameterKey] = initialValues[param.parameterKey] ?? param.default ?? null
        return acc
    }, {} as Record<string, any>)

    const [values, setValues] = useState<Record<string, any>>(initialFormValues)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [hasChanged, setHasChanged] = useState(false)

    const editStepParameters = useMutation(api.data_functions.workflow_steps.editStepParameterValues)

    // Get the relevant values for a parameter's showIf condition
    const getRelevantValues = (parameter: Parameter) => {
        if (!parameter.showIf) return {}

        const { parameterKey } = parameter.showIf
        return { [parameterKey]: values[parameterKey] }
    }

    useEffect(() => {
        setValues(initialFormValues)
        setErrors({})
        setHasChanged(false)
    }, [initialValues, parameters])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setValues({})
            setErrors({})
            setHasChanged(false)
        }
    }, [])

    const validateForm = (values: Record<string, any>) => {
        const formSchema = createFormSchema(parameters, values)
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

    const handleChange = (parameterKey: string, value: any) => {
        const newValues = { ...values, [parameterKey]: value }
        setValues(newValues)
        setHasChanged(true)

        // Validate only the changed input
        const parameter = parameters.find(p => p.parameterKey === parameterKey)
        if (parameter) {
            const isVisible = isParameterVisible(parameter, newValues)
            const schema = createParameterSchema(parameter, isVisible)
            const result = schema.safeParse(value)

            if (result.success) {
                // Clear error for this field if validation passes
                setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors[parameterKey]
                    return newErrors
                })
            } else {
                setErrors(prev => ({
                    ...prev,
                    [parameterKey]: result.error.issues[0].message
                }))
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
            toast.success('Changes saved')
            onSave?.()
        } catch (error) {
            toast.error('Failed to save, try again')
            console.error('Failed to save parameters:', error)
        }
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <>
            <div className="min-h-0 overflow-y-auto space-y-4">
                {parameters.map(parameter => (
                    <ParameterInput
                        key={parameter.parameterKey}
                        parameter={parameter}
                        value={values[parameter.parameterKey]}
                        onChange={(value) => handleChange(parameter.parameterKey, value)}
                        error={errors[parameter.parameterKey]}
                        otherValues={getRelevantValues(parameter)}
                    />
                ))}
            </div>
            {hasChanged && (
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
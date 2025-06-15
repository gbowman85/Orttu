'use client'

import { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Parameter } from '@/../convex/types'
import { ParameterInput } from './ParameterInput'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Id } from '@/../convex/_generated/dataModel'

interface ParameterFormProps {
  parameters: Parameter[]
  initialValues: Record<string, any>
  stepId: Id<'trigger_steps'> | Id<'action_steps'>
  workflowConfigId: Id<'workflow_configurations'>
  onSave?: () => void
}

export function ParameterForm({ 
  parameters, 
  initialValues, 
  stepId, 
  workflowConfigId,
  onSave 
}: ParameterFormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanged, setHasChanged] = useState(false)

  const editStepParameters = useMutation(api.data_functions.workflow_steps.editStepParameterValues)

  useEffect(() => {
    setValues(initialValues)
    setErrors({})
    setHasChanged(false)
  }, [initialValues])

  const validateParameter = (parameter: Parameter, value: any): string | undefined => {
    if (parameter.required && (value === undefined || value === '')) {
      return 'This field is required'
    }

    if (value === undefined || value === '') {
      return undefined
    }

    const validation = parameter.validation
    if (!validation) return undefined

    if (parameter.dataType === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        return `Minimum length is ${validation.minLength}`
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return `Maximum length is ${validation.maxLength}`
      }
      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        return 'Invalid format'
      }
      if (validation.allowedValues && !validation.allowedValues.includes(value)) {
        return 'Invalid value'
      }
    }

    if (parameter.dataType === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        return `Minimum value is ${validation.min}`
      }
      if (validation.max !== undefined && value > validation.max) {
        return `Maximum value is ${validation.max}`
      }
    }

    return undefined
  }

  const handleChange = (parameterKey: string, value: any) => {
    setValues(prev => ({ ...prev, [parameterKey]: value }))
    setHasChanged(true)

    const parameter = parameters.find(p => p.parameterKey === parameterKey)
    if (parameter) {
      const error = validateParameter(parameter, value)
      setErrors(prev => ({ ...prev, [parameterKey]: error || '' }))
    }
  }

  const handleSubmit = async () => {
    // Validate all parameters
    const newErrors: Record<string, string> = {}
    parameters.forEach(parameter => {
      const error = validateParameter(parameter, values[parameter.parameterKey])
      if (error) {
        newErrors[parameter.parameterKey] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
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
      toast.success('Parameters saved successfully')
      onSave?.()
    } catch (error) {
      toast.error('Failed to save parameters')
      console.error('Failed to save parameters:', error)
    }
  }

  return (
    <div className="space-y-4">
      {parameters.map(parameter => (
        <ParameterInput
          key={parameter.parameterKey}
          parameter={parameter}
          value={values[parameter.parameterKey]}
          onChange={(value) => handleChange(parameter.parameterKey, value)}
          error={errors[parameter.parameterKey]}
        />
      ))}
      {hasChanged && (
        <Button 
          onClick={handleSubmit}
          className="w-full"
        >
          Save Changes
        </Button>
      )}
    </div>
  )
} 
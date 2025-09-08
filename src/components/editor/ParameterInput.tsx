'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { DatePicker } from '@/components/ui/date-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Parameter } from '@/../convex/types'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Info } from 'lucide-react'
import { InputWithMentions } from './InputWithMentions'

interface ParameterInputProps {
    parameter: Parameter
    value: unknown
    onChange: (value: unknown) => void
    error?: string
    otherValues?: Record<string, unknown>
}

export function ParameterInput({ parameter, value, onChange, error, otherValues = {} }: ParameterInputProps) {
    const shouldHide = () => {
        if (!parameter.showIf || !otherValues) return false

        const { parameterKey, operator, value: conditionValue } = parameter.showIf
        const compareValue = otherValues[parameterKey]

        // If the condition is met, show the parameter
        const shouldShow = (() => {
            switch (operator) {
                case 'equals':
                    return compareValue === conditionValue
                case 'notEquals':
                    return compareValue !== conditionValue
                case 'greaterThan':
                    return typeof compareValue === 'number' && typeof conditionValue === 'number' && compareValue > conditionValue
                case 'lessThan':
                    return typeof compareValue === 'number' && typeof conditionValue === 'number' && compareValue < conditionValue
                case 'contains':
                    return Array.isArray(compareValue) && compareValue.includes(conditionValue)
                case 'notContains':
                    return Array.isArray(compareValue) && !compareValue.includes(conditionValue)
                default:
                    return false
            }
        })()

        // Hide if the condition is not met
        return !shouldShow
    }

    if (shouldHide()) return null

    const renderInput = () => {
        // Use inputType if specified
        if (parameter.inputType) {
            switch (parameter.inputType) {
                case 'text':
                    return (
                        <InputWithMentions
                            value={typeof value === 'string' ? value : ''}
                            onChange={onChange}
                            placeholder={`Enter ${parameter.title.toLowerCase()}`}
                        />
                    )
                case 'textarea':
                    return (
                        <InputWithMentions
                            value={typeof value === 'string' ? value : ''}
                            onChange={onChange}
                            placeholder={`Enter ${parameter.title.toLowerCase()}`}
                            isTextarea={true}
                        />
                    )
                case 'select':
                    return (
                        <Select
                            value={typeof value === 'string' ? value : ''}
                            onValueChange={(v) => onChange(v)}
                        >
                            <SelectTrigger aria-label={parameter.title}>
                                <SelectValue placeholder="Select a value" />
                            </SelectTrigger>
                            <SelectContent>
                                {parameter.validation?.allowedValues?.map((option, index) => (
                                    <SelectItem key={option} value={option}>
                                        {parameter.validation?.allowedValueLabels?.[index] ?? option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                case 'checkbox':
                case 'switch':
                    return (
                        <Switch
                            checked={typeof value === 'boolean' ? value : false}
                            onCheckedChange={(checked) => onChange(checked)}
                            aria-label={parameter.title}
                        />
                    )
                case 'date':
                    return (
                        <DatePicker
                            value={typeof value === 'string' || value instanceof Date ? value : undefined}
                            onChange={(date) => onChange(date ? date.getTime() : undefined)}
                            placeholder={`Select ${parameter.inputType}`}
                        />
                    )
                case 'datetime':
                    return (
                        <DatePicker
                            value={typeof value === 'string' || value instanceof Date ? value : undefined}
                            onChange={(date) => onChange(date ? date.getTime() : undefined)}
                            placeholder={`Select ${parameter.inputType}`}
                            showTime={true}
                        />
                    )
                case 'number':
                    return (
                        <Input
                            type="number"
                            value={typeof value === 'number' ? value : (typeof value === 'string' ? value : '')}
                            onChange={(e) => onChange(Number(e.target.value))}
                            min={parameter.validation?.min}
                            max={parameter.validation?.max}
                            placeholder={`Enter ${parameter.title.toLowerCase()}`}
                        />
                    )
                case 'file':
                case 'image':
                    return (
                        <Input
                            type="file"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            accept={parameter.inputType === 'image' ? 'image/*' : undefined}
                        />
                    )
            }
        }

        // Use dataType if no inputType is specified
        switch (parameter.dataType) {
            case 'string':
                return parameter.validation?.allowedValues ? (
                    <Select
                        value={typeof value === 'string' ? value : ''}
                        onValueChange={(v) => onChange(v)}
                    >
                        <SelectTrigger aria-label={parameter.title}>
                            <SelectValue placeholder="Select a value" />
                        </SelectTrigger>
                        <SelectContent>
                            {parameter.validation.allowedValues.map((option, index) => (
                                <SelectItem key={option} value={option}>
                                    {parameter.validation?.allowedValueLabels?.[index] ?? option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <InputWithMentions
                        value={typeof value === 'string' ? value : ''}
                        onChange={onChange}
                        placeholder={`Enter ${parameter.title.toLowerCase()}`}
                    />
                )

            case 'number':
                return (
                    <Input
                        type="number"
                        value={typeof value === 'number' ? value : (typeof value === 'string' ? value : '')}
                        onChange={(e) => onChange(Number(e.target.value))}
                        min={parameter.validation?.min}
                        max={parameter.validation?.max}
                        placeholder={`Enter ${parameter.title.toLowerCase()}`}
                    />
                )

            case 'boolean':
                return (
                    <Switch
                        checked={typeof value === 'boolean' ? value : false}
                        onCheckedChange={(checked) => onChange(checked)}
                        aria-label={parameter.title}
                    />
                )

            case 'date':
                return (
                    <DatePicker
                        value={typeof value === 'string' || value instanceof Date ? value : undefined}
                        onChange={(date) => onChange(date ? date.getTime() : undefined)}
                    />
                )
            case 'datetime':
                return (
                    <DatePicker
                        value={typeof value === 'string' || value instanceof Date ? value : undefined}
                        onChange={(date) => onChange(date ? date.getTime() : undefined)}
                        showTime={true}
                    />
                )

            case 'array':
                return (
                    <Textarea
                        value={Array.isArray(value) ? value.join('\n') : ''}
                        onChange={(e) => onChange(e.target.value.split('\n'))}
                        placeholder="Enter values (one per line)"
                        className="min-h-[1.5rem] resize-y"
                    />
                )

            case 'object':
                return (
                    <Textarea
                        value={typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : ''}
                        onChange={(e) => {
                            try {
                                onChange(JSON.parse(e.target.value))
                            } catch {
                                // Invalid JSON, ignore
                            }
                        }}
                        placeholder="Enter JSON object"
                        className="min-h-[1.5rem] resize-y font-mono"
                    />
                )

            default:
                return (
                    <InputWithMentions
                        value={typeof value === 'string' ? value : ''}
                        onChange={onChange}
                        placeholder={`Enter ${parameter.title.toLowerCase()}`}
                    />
                )
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label htmlFor={parameter.parameterKey}>
                    {parameter.title}
                    {parameter.required && <span className="text-destructive ml-0.5">*</span>}
                </Label>
                {parameter.description && (
                    <HoverCard>
                        <HoverCardTrigger>
                            <Info className="h-4 w-4 text-muted-foreground opacity-30 hover:opacity-100 transition-opacity cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent className="bg-gray-50 opacity-95 text-sm border-gray-400">
                            <p>{parameter.description}</p>
                        </HoverCardContent>
                    </HoverCard>
                )}
            </div>
            
            {renderInput()}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    )
} 
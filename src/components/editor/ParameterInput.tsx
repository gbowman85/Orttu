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

interface ParameterInputProps {
    parameter: Parameter
    value: any
    onChange: (value: any) => void
    error?: string
}

export function ParameterInput({ parameter, value, onChange, error }: ParameterInputProps) {
    const renderInput = () => {
        // Use inputType if specified
        if (parameter.inputType) {
            switch (parameter.inputType) {
                case 'text':
                    return (
                        <Input
                            value={value ?? ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={`Enter ${parameter.title.toLowerCase()}`}
                        />
                    )
                case 'textarea':
                    return (
                        <Textarea
                            value={value ?? ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={`Enter ${parameter.title.toLowerCase()}`}
                            className="min-h-[4rem] resize-y"
                        />
                    )
                case 'select':
                    return (
                        <Select
                            value={value ?? ''}
                            onValueChange={onChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a value" />
                            </SelectTrigger>
                            <SelectContent>
                                {parameter.validation?.allowedValues?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                case 'checkbox':
                case 'switch':
                    return (
                        <Switch
                            checked={value ?? false}
                            onCheckedChange={onChange}
                        />
                    )
                case 'date':
                    return (
                        <DatePicker
                            value={value}
                            onChange={(date) => onChange(date?.toISOString())}
                            placeholder={`Select ${parameter.inputType}`}
                        />
                    )
                case 'datetime':
                    return (
                        <DatePicker
                            value={value}
                            onChange={(date) => onChange(date?.toISOString())}
                            placeholder={`Select ${parameter.inputType}`}
                        />
                    )
                case 'number':
                    return (
                        <Input
                            type="number"
                            value={value ?? ''}
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
                        value={value ?? ''}
                        onValueChange={onChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a value" />
                        </SelectTrigger>
                        <SelectContent>
                            {parameter.validation.allowedValues.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Textarea
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter ${parameter.title.toLowerCase()}`}
                        className="min-h-[1.5rem] resize-y"
                    />
                )

            case 'number':
                return (
                    <Input
                        type="number"
                        value={value ?? ''}
                        onChange={(e) => onChange(Number(e.target.value))}
                        min={parameter.validation?.min}
                        max={parameter.validation?.max}
                        placeholder={`Enter ${parameter.title.toLowerCase()}`}
                    />
                )

            case 'boolean':
                return (
                    <Switch
                        checked={value ?? false}
                        onCheckedChange={onChange}
                    />
                )

            case 'date':
            case 'datetime':
                return (
                    <DatePicker
                        value={value}
                        onChange={(date) => onChange(date?.toISOString())}
                        placeholder={`Select ${parameter.dataType}`}
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
                    <Input
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
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
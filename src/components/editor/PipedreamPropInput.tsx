'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { DatePicker } from '@/components/ui/date-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PipedreamConfigurableProp } from '@/../convex/types'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Info } from 'lucide-react'
import { useRef, useEffect } from 'react'

interface PipedreamPropInputProps {
    prop: PipedreamConfigurableProp
    value: any
    onChange: (value: any) => void
    error?: string
    options?: Array<{ label: string; value?: any }>
}

export function PipedreamPropInput({
    prop,
    value,
    onChange,
    error,
    options = []
}: PipedreamPropInputProps) {
    // Don't render if the prop is hidden
    if (prop.hidden) {
        return null
    }

    // Don't render if the prop is disabled
    if (prop.disabled) {
        return null
    }

    // Don't render if the prop type is "app"
    if (prop.type === 'app') {
        return null
    }

    const renderInput = () => {
        // Handle remote options with label-value format
        if (prop.remoteOptions && options.length > 0) {
            return (
                <Select
                    value={value?.__lv?.value ?? value ?? ''}
                    onValueChange={(selectedValue) => {
                        const option = options.find(opt => opt.value === selectedValue)
                        if (option && prop.withLabel) {
                            onChange({ __lv: { label: option.label, value: selectedValue } })
                        } else {
                            onChange(selectedValue)
                        }
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value ?? option.label} value={option.value ?? ''}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        }

        // Handle different types
        switch (prop.type) {
            case 'string':
                return (
                    <Input
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter ${prop.label?.toLowerCase() || prop.name.toLowerCase()}`}
                    />
                )

            case 'text':
                return (
                    <Textarea
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter ${prop.label?.toLowerCase() || prop.name.toLowerCase()}`}
                        className="min-h-[4rem] resize-y"
                    />
                )

            case 'number':
                return (
                    <Input
                        type="number"
                        value={value ?? ''}
                        onChange={(e) => onChange(Number(e.target.value))}
                        placeholder={`Enter ${prop.label?.toLowerCase() || prop.name.toLowerCase()}`}
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
                return (
                    <DatePicker
                        value={value}
                        onChange={(date) => onChange(date?.getTime())}
                        placeholder={`Select ${prop.label?.toLowerCase() || prop.name.toLowerCase()}`}
                    />
                )

            case 'datetime':
                return (
                    <DatePicker
                        value={value}
                        onChange={(date) => onChange(date?.getTime())}
                        placeholder={`Select ${prop.label?.toLowerCase() || prop.name.toLowerCase()}`}
                        showTime={true}
                    />
                )

            case 'array':
                return (
                    <Textarea
                        value={Array.isArray(value) ? value.join('\n') : ''}
                        onChange={(e) => onChange(e.target.value.split('\n').filter(Boolean))}
                        placeholder="Enter values (one per line)"
                        className="min-h-[4rem] resize-y"
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
                        className="min-h-[4rem] resize-y font-mono"
                    />
                )

            case 'file':
                return (
                    <Input
                        type="file"
                        onChange={(e) => onChange(e.target.files?.[0])}
                    />
                )

            case 'image':
                return (
                    <Input
                        type="file"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        accept="image/*"
                    />
                )

            case 'dir':
                return (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                        <div className="flex-1">
                            <p className="text-sm font-medium">Directory Access</p>
                            <p className="text-xs text-muted-foreground">
                                {prop.accessMode === 'write' ? 'Read/Write' : 'Read Only'} access
                                {prop.sync && ' • Sync enabled'}
                            </p>
                        </div>
                    </div>
                )

            default:
                return (
                    <Input
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter ${prop.label?.toLowerCase() || prop.name.toLowerCase()}`}
                    />
                )
        }
    }

    const displayLabel = prop.label || prop.name
    const isRequired = !prop.optional

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label htmlFor={prop.name}>
                    {displayLabel}
                    {isRequired && <span className="text-destructive ml-0.5">*</span>}
                </Label>
                {prop.description && (
                    <HoverCard>
                        <HoverCardTrigger>
                            <Info className="h-4 w-4 text-muted-foreground opacity-30 hover:opacity-100 transition-opacity cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent className="bg-gray-50 opacity-95 text-sm border-gray-400">
                            <p>{prop.description}</p>
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

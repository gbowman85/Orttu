'use client'

import { Mention, MentionsInput } from 'react-mentions'
import { useAvailableOutputs } from '@/hooks/useAvailableOutputs'
import { cn } from '@/lib/utils'
import { useRef, useEffect } from 'react'

// Global registry for MentionsInput components
const mentionsInputRegistry = new Map<Element, (text: string) => void>()

// Initialize the global registry on window if it doesn't exist
if (typeof window !== 'undefined' && !(window as unknown as { __mentionsInputRegistry?: Map<Element, (text: string) => void> }).__mentionsInputRegistry) {
    (window as unknown as { __mentionsInputRegistry: Map<Element, (text: string) => void> }).__mentionsInputRegistry = mentionsInputRegistry
}

function registerMentionsInput(element: Element, insertTextFn: (text: string) => void) {
    mentionsInputRegistry.set(element, insertTextFn)
}

function unregisterMentionsInput(element: Element) {
    mentionsInputRegistry.delete(element)
}

interface MentionsInputProps {
    value: string
    onChange: (value: string) => void
    placeholder: string
    className?: string
    isTextarea?: boolean
}

export function InputWithMentions({
    value,
    onChange,
    placeholder,
    className = '',
    isTextarea = false
}: MentionsInputProps) {
    const { availableOutputs } = useAvailableOutputs()
    const inputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Use the appropriate ref based on whether it's a textarea
    const currentInputRef = isTextarea ? textareaRef : inputRef

    // Register this component with the global registry
    useEffect(() => {
        if (containerRef.current) {
            const insertTextFn = (text: string) => {
                if (currentInputRef.current) {
                    const start = currentInputRef.current.selectionStart ?? 0
                    const end = currentInputRef.current.selectionEnd ?? 0
                    const currentValue = value

                    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end)
                    onChange(newValue)

                    setTimeout(() => {
                        const newCursorPos = start + text.length
                        currentInputRef.current?.setSelectionRange(newCursorPos, newCursorPos)
                    }, 0)
                }
            }

            registerMentionsInput(containerRef.current, insertTextFn)

            const currentContainer = containerRef.current
            return () => {
                if (currentContainer) {
                    unregisterMentionsInput(currentContainer)
                }
            }
        }
    }, [value, onChange, currentInputRef, containerRef])

    // Transform available outputs into the format expected by react-mentions
    const mentionData = (availableOutputs || []).flatMap(step =>
        (step.outputs || []).map(output => ({
            id: `${step.stepId}.${output.outputKey}`,
            display: ` ${step.stepTitle} (${output.outputTitle})`,
            stepTitle: step.stepTitle,
            outputTitle: output.outputTitle,
            outputKey: output.outputKey,
            outputDescription: output.outputDescription
        }))
    ).filter(item => item.id && item.display) // Ensure we have valid data

    const inputStyle = {
        ...(isTextarea && {
            minHeight: '4rem',
            resize: 'vertical' as const
        }),
        focusVisible: {
            border: 'none',
            ring: 'none'
        },
        focus: {
            border: 'none',
            ring: 'none'
        }
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 px-1 py-2 w-full min-w-0 rounded-md border bg-white text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                isTextarea && "min-h-[4rem] resize-y",
            ) + className}
            data-mentions-input="true"
        >
            <MentionsInput
                inputRef={currentInputRef}
                value={value}
                onChange={(e: { target: { value: string } }) => onChange(e.target.value)}
                placeholder={placeholder}
                style={inputStyle}
                singleLine={!isTextarea}
                className="w-full h-full"
                customSuggestionsContainer={(children) => (
                    <div className="bg-white border-2 border-gray-200 shadow-md rounded p-2">
                        {children}
                    </div>
                )}
            >
                <Mention
                    trigger="{{"
                    data={mentionData}
                    markup="{{__id__}}"
                    displayTransform={(id: string, display: string) => {
                        // Find the suggestion data to get the display value
                        const suggestion = mentionData.find(item => item.id === id)
                        return suggestion ? suggestion.display : display
                    }}
                    className="bg-gray-100 border border-gray-300 rounded"
                    renderSuggestion={(suggestion: { display?: string }) => (
                        <div className="bg-gray-100 border-2 border-gray-400 rounded mb-1">
                            {suggestion.display}
                        </div>
                    )}
                />
            </MentionsInput>
        </div>
    )
}

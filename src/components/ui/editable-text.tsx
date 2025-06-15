'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type ElementType = React.ElementType

interface EditableTextProps<T extends ElementType = 'div'> extends React.HTMLAttributes<HTMLElement> {
    value: string
    fallbackValue?: string
    onSave: (value: string) => Promise<void> | void
    className?: string
    inputClassName?: string
    placeholder?: string
    elementType?: T
    longText?: boolean
}

export function EditableText<T extends ElementType = 'div'>({
    value,
    fallbackValue,
    onSave,
    className,
    inputClassName,
    placeholder,
    elementType,
    longText,
    ...props
}: EditableTextProps<T>) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [editValue, setEditValue] = React.useState(value)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useEffect(() => {
        if (isEditing) {
            const element = longText ? textareaRef.current : inputRef.current
            if (element) {
                element.focus()
                if (!longText) {
                    element.select()
                }
            }
        }
    }, [isEditing, longText])

    const handleClick = () => {
        setIsEditing(true)
        setEditValue(value)
    }

    const handleSave = async () => {
        if (editValue !== value) {
            await onSave(editValue)
        }
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave()
        } else if (e.key === 'Escape') {
            setIsEditing(false)
            setEditValue(value)
        }
    }

    if (isEditing) {
        if (longText) {
            return (
                <textarea
                    ref={textareaRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'w-full bg-transparent border border-gray-300 rounded -mx-1 px-1 outline-none focus:border-primary focus:ring-1 focus:ring-secondary min-h-[100px] resize-y',
                        inputClassName
                    )}
                    placeholder={placeholder}
                />
            )
        }
        return (
            <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={cn(
                    'w-full bg-transparent border border-gray-300 rounded -mx-1 px-1 outline-none focus:border-primary focus:ring-1 focus:ring-secondary',
                    inputClassName
                )}
                placeholder={placeholder}
            />
        )
    }

    const Component = elementType || 'div'
    return (
        <Component
            onClick={handleClick}
            className={cn(
                'border border-transparent hover:border hover:border-gray-300 hover:cursor-text rounded',
                className
            )}
            {...props}
        >
            {value || fallbackValue || ''}
        </Component>
    )
} 
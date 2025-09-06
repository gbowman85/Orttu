'use client'

import { Button } from "@/components/ui/button"
import { DatabaseIcon, X, ChevronDown, ChevronRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { useAvailableOutputs } from '@/hooks/useAvailableOutputs'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { Badge } from '@/components/ui/badge'
import { insertTextAtCursor } from '@/lib/utils'
import { toast } from 'sonner'

interface DataPopupProps {
    children?: React.ReactNode
}

export function DataPopup({ children }: DataPopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ x: -200, y: 0 })
    const [hasBeenDragged, setHasBeenDragged] = useState(false)
    const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
    const [lastFocusedElement, setLastFocusedElement] = useState<Element | null>(null)
    const { availableOutputs } = useAvailableOutputs()
    const { selectedStepId } = useWorkflowEditor()

    const handleToggle = () => setIsOpen(!isOpen)
    const handleClose = () => setIsOpen(false)

    const toggleStepExpansion = (stepId: string) => {
        setExpandedSteps(prev => {
            const newSet = new Set(prev)
            if (newSet.has(stepId)) {
                newSet.delete(stepId)
            } else {
                newSet.add(stepId)
            }
            return newSet
        })
    }

    // Calculate initial position when component mounts (only if never dragged)
    useEffect(() => {
        if (!hasBeenDragged) {
            const calculatePosition = () => {
                const x = -200
                const y = 0
                setPosition({ x, y })
            }

            calculatePosition()
            window.addEventListener('resize', calculatePosition)

            return () => window.removeEventListener('resize', calculatePosition)
        }
    }, [hasBeenDragged])

    // Track the last focused element
    useEffect(() => {
        const handleFocusChange = () => {
            const activeElement = document.activeElement
            if (activeElement &&
                (activeElement instanceof HTMLInputElement ||
                    activeElement instanceof HTMLTextAreaElement ||
                    activeElement.getAttribute('contenteditable') === 'true')) {
                setLastFocusedElement(activeElement)
            }
        }

        document.addEventListener('focusin', handleFocusChange)
        return () => document.removeEventListener('focusin', handleFocusChange)
    }, [])

    const handleDragEnd = (event: any, info: PanInfo) => {
        setPosition(prev => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y
        }))
        setHasBeenDragged(true)
    }

    const getDataTypeColor = (dataType: string) => {
        switch (dataType) {
            case 'string':
                return 'bg-blue-100 text-blue-800'
            case 'number':
                return 'bg-green-100 text-green-800'
            case 'boolean':
                return 'bg-purple-100 text-purple-800'
            case 'array':
                return 'bg-orange-100 text-orange-800'
            case 'object':
                return 'bg-red-100 text-red-800'
            case 'date':
            case 'datetime':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const handleOutputClick = (outputKey: string, stepId: string) => {
        const outputReference = `{{${stepId}.${outputKey}}}`

        const success = insertTextAtCursor(outputReference, lastFocusedElement || undefined)

        if (success) {
            // Restore focus to the text field after insertion
            if (lastFocusedElement instanceof HTMLElement) {
                lastFocusedElement.focus()
            }
        } else {
            toast.error('No text field is currently focused. Click on a text field first.')
        }
    }

    return (
        <>
            {/* Button */}
            <div onClick={handleToggle}>
                {children || (
                    <Button variant="outline" className="w-full justify-between">
                        <DatabaseIcon className="w-4 h-4 mr-2" />
                        {isOpen ? 'Hide Data' : 'Show Data'}
                    </Button>
                )}
            </div>

            {/* Draggable Modal */}
            {isOpen && (
                <motion.div
                    className="fixed z-50 bg-white border-2 border-gray-400 shadow-lg rounded-lg w-96 max-w-[90vw] cursor-move"
                    initial={position}
                    drag
                    dragMomentum={false}
                    dragElastic={0}
                    onDragEnd={handleDragEnd}
                    dragConstraints={{
                        left: -window.innerWidth + 400,
                        right: window.innerWidth - 850,
                        top: 0,
                        bottom: window.innerHeight - 300,
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-200 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-gray-900">Available Data</h3>
                        <button
                            onClick={handleClose}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 bg-gray-100 rounded-b-lg cursor-default max-h-96 overflow-y-auto">
                        {!selectedStepId ? (
                            <p className="text-sm text-gray-600">
                                Select a step to see available data from previous actions.
                            </p>
                        ) : availableOutputs.length === 0 ? (
                            <p className="text-sm text-gray-600">
                                No data available from previous steps.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 mb-3">
                                    Click on any data item to insert it into the currently focused text field.
                                </p>

                                {availableOutputs.map((step) => (
                                    <div key={step.stepId} className="bg-white rounded-lg border border-gray-200">
                                        <button
                                            onClick={() => toggleStepExpansion(step.stepId)}
                                            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center space-x-2">
                                                {expandedSteps.has(step.stepId) ? (
                                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                                )}
                                                <span className="font-medium text-sm">{step.stepTitle}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {step.stepType}
                                                </Badge>
                                            </div>
                                        </button>

                                        {expandedSteps.has(step.stepId) && (
                                            <div className="border-t border-gray-200 p-3 space-y-2">
                                                {step.outputs.map((output) => (
                                                    <div
                                                        key={output.outputKey}
                                                        onClick={() => handleOutputClick(output.outputKey, step.stepId)}
                                                        className="flex items-center justify-between p-2 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group"
                                                        title={`Click to insert ${step.stepTitle} (${output.outputTitle})`}
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm font-medium group-hover:text-blue-700">{output.outputTitle}</span>
                                                                <Badge className={`text-xs ${getDataTypeColor(output.outputDataType)}`}>
                                                                    {output.outputDataType}
                                                                </Badge>
                                                            </div>
                                                            {output.outputDescription && (
                                                                <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600">{output.outputDescription}</p>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Click to insert
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </>
    )
}

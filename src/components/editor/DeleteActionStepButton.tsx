'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Id } from '@/../convex/_generated/dataModel'

interface DeleteActionStepButtonProps {
    actionStepId: Id<"action_steps">
    parentId: Id<"action_steps"> | 'root'
    parentKey: string
    className?: string
    onDeleteClick: (actionStepId: Id<"action_steps">, parentId: Id<"action_steps"> | 'root', parentKey: string) => void
}

export function DeleteActionStepButton({ 
    actionStepId, 
    parentId, 
    parentKey, 
    className = '',
    onDeleteClick
}: DeleteActionStepButtonProps) {
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDeleteClick(actionStepId, parentId, parentKey)
    }

    return (
        <div className={`flex justify-center ${className}`}>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleButtonClick}
                className="group/delete-action-step-button h-8 w-8 rounded-full hover:bg-red-300/50 cursor-pointer"
            >
                <Trash2 className="h-4 w-4 text-grey-100 group-hover/delete-action-step-button:text-red-600" />
            </Button>
        </div>
    )
} 
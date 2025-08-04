'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteTriggerButtonProps {
    className?: string
    onDeleteClick: () => void
}

export function DeleteTriggerButton({ 
    className = '',
    onDeleteClick
}: DeleteTriggerButtonProps) {
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDeleteClick()
    }

    return (
        <div className={`flex justify-center ${className}`}>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleButtonClick}
                className="group/delete-button h-8 w-8 rounded-full hover:bg-red-300/50 cursor-pointer"
            >
                <Trash2 className="h-4 w-4 text-grey-100 group-hover/delete-button:text-red-600" />
            </Button>
        </div>
    )
} 
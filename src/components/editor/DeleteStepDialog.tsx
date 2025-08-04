'use client'

import { Trash2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteStepDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    itemTitle?: string | null
    itemType: 'action-step' | 'trigger'
    isDeleting?: boolean
}

export function DeleteStepDialog({
    isOpen,
    onClose,
    onConfirm,
    itemTitle,
    itemType,
    isDeleting = false
}: DeleteStepDialogProps) {
    const getTitle = () => {
        return itemType === 'trigger' ? 'Delete Trigger' : 'Delete Action Step'
    }

    const getDescription = () => {
        const itemName = itemType === 'trigger' ? 'trigger' : 'action step'
        if (itemTitle) {
            return (
                <>
                    Are you sure you want to delete <strong>{itemTitle}</strong>?<br />
                    This cannot be undone.
                </>
            )
        }
        return (
            <>
                Are you sure you want to delete this {itemName}?<br />
                This cannot be undone.
            </>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        {getTitle()}
                    </DialogTitle>
                    <DialogDescription>
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 
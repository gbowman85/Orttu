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
import { Id } from '@/../convex/_generated/dataModel'

interface DeleteWorkflowDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  workflowTitle: string
}

export function DeleteWorkflowDialog({
  isOpen,
  onClose,
  onConfirm,
  workflowTitle
}: DeleteWorkflowDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Delete Workflow
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{workflowTitle}</strong>?<br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
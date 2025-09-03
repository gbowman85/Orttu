'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAction, useMutation } from 'convex/react'
import { api } from "@/../convex/_generated/api"
import { Id } from "@/../convex/_generated/dataModel"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface TestWorkflowDialogProps {
  workflowId: Id<"workflows">
  workflowTitle: string
  isOpen: boolean
  onClose: () => void
}

export function TestWorkflowDialog({ 
  workflowId, 
  workflowTitle, 
  isOpen, 
  onClose 
}: TestWorkflowDialogProps) {
  const router = useRouter()
  const triggerWorkflow = useMutation(api.workflow_execution.triggerWorkflowManually)
  const [isExecuting, setIsExecuting] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsExecuting(true)
      await triggerWorkflow({ workflowId })
      toast.success('Workflow test started successfully')
      onClose()
      
      // Navigate to activity page to see the workflow status
      router.push(`/w/${workflowId}/activity`)
    } catch (error) {
      console.error('Failed to trigger workflow:', error)
      toast.error('Failed to start workflow test. Please try again.')
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Test Run</DialogTitle>
          <DialogDescription>
            Run the workflow &quot;{workflowTitle}&quot; now? <br />
            This will execute the workflow in the background and you can monitor the status in the activity page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isExecuting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isExecuting}
          >
            {isExecuting ? 'Starting...' : 'Run Workflow'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

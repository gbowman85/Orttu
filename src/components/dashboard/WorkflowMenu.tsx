'use client'

import { useState } from 'react'
import { 
  ExternalLink, 
  Share2, 
  Download, 
  Star, 
  Tag, 
  Trash2 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import { Id } from '@/../convex/_generated/dataModel'
import { DeleteWorkflowDialog } from '@/components/dashboard/DeleteWorkflowDialog'

interface WorkflowMenuProps {
  workflow: {
    _id: Id<"workflows">
    title: string
    starred: boolean
  }
  onStarToggle: (workflowId: Id<"workflows">, isStarred: boolean) => void
  onOpen: (workflowId: Id<"workflows">) => void
  onShare: (workflowId: Id<"workflows">) => void
  onExport: (workflowId: Id<"workflows">) => void
  onDelete: (workflowId: Id<"workflows">, workflowTitle: string) => void
}

export function WorkflowMenu({
  workflow,
  onStarToggle,
  onOpen,
  onShare,
  onExport,
  onDelete
}: WorkflowMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(workflow._id, workflow.title)
    setIsDeleteDialogOpen(false)
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full hover:bg-primary-background"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{workflow.title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => onOpen(workflow._id)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onShare(workflow._id)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onExport(workflow._id)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => onStarToggle(workflow._id, !workflow.starred)}>
            <Star className="mr-2 h-4 w-4" />
            {workflow.starred ? 'Unstar' : 'Star'}
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tag className="mr-2 h-4 w-4" />
              Tag as...
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {/* Submenu items will be added later */}
              <DropdownMenuItem disabled>
                TBD...
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteWorkflowDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        workflowTitle={workflow.title}
      />
    </>
  )
} 
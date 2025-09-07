'use client'

import { useState } from 'react'
import { 
  ExternalLink, 
  Share2, 
  Download, 
  Star, 
  Tag, 
  Trash2,
  Plus
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
import { Input } from '@/components/ui/input'
import { MoreVertical } from 'lucide-react'
import { Id } from '@/../convex/_generated/dataModel'
import { DeleteWorkflowDialog } from '@/components/dashboard/DeleteWorkflowDialog'
import { useWorkflows } from '@/contexts/WorkflowsContext'

interface WorkflowMenuProps {
  workflow: {
    _id: Id<"workflows">
    title: string
    starred: boolean
    tags?: string[]
  }
  onStarToggle: (workflowId: Id<"workflows">, isStarred: boolean) => void
  onOpen: (workflowId: Id<"workflows">) => void
  onShare: (workflowId: Id<"workflows">) => void
  onExport: (workflowId: Id<"workflows">) => void
  onDelete: (workflowId: Id<"workflows">, workflowTitle: string) => void
  onAddTag: (workflowId: Id<"workflows">, tag: string) => Promise<void>
  onRemoveTag: (workflowId: Id<"workflows">, tag: string) => Promise<void>
}

export function WorkflowMenu({
  workflow,
  onStarToggle,
  onOpen,
  onShare,
  onExport,
  onDelete,
  onAddTag,
  onRemoveTag
}: WorkflowMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const { allTags } = useWorkflows()

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

  const handleAddTag = async () => {
    if (!newTag.trim()) return
    
    setIsAddingTag(true)
    try {
      await onAddTag(workflow._id, newTag.trim())
      setNewTag('')
    } catch {
      // Error is already handled in the context
    } finally {
      setIsAddingTag(false)
    }
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleTagToggle = async (e: React.MouseEvent, tag: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    const currentTags = workflow.tags || []
    const hasTag = currentTags.includes(tag)
    
    if (hasTag) {
      await onRemoveTag(workflow._id, tag)
    } else {
      await onAddTag(workflow._id, tag)
    }
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
            <DropdownMenuSubContent className="w-56 p-2">
              <div className="space-y-2">
                {/* Existing tags */}
                {allTags.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500 px-2 py-1">Available tags</div>
                    {allTags.map((tag) => {
                      const currentTags = workflow.tags || []
                      const isChecked = currentTags.includes(tag)
                      return (
                        <DropdownMenuItem
                          key={tag}
                          onClick={(e) => handleTagToggle(e, tag)}
                          className="flex items-center gap-2 px-2 py-1 cursor-pointer"
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                            isChecked ? 'bg-primary border-primary' : 'border-gray-300'
                          }`}>
                            {isChecked && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm">{tag}</span>
                        </DropdownMenuItem>
                      )
                    })}
                  </div>
                )}
                
                {/* Add new tag */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 px-2 py-1">Add a new tag</div>
                  <Input
                    placeholder="Enter tag name..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    maxLength={20}
                    className="h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || isAddingTag}
                    className="w-full h-8"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {isAddingTag ? 'Adding...' : 'Add Tag'}
                  </Button>
                </div>
              </div>
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
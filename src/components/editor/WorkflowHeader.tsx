import { StarToggle } from '@/components/ui/star-toggle'
import { Doc } from '@/../convex/_generated/dataModel'
import { Skeleton } from '@/components/ui/skeleton'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { toast } from 'sonner'
import { useState, useMemo } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditableText } from '@/components/ui/editable-text'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { z } from 'zod'

// Tag validation schema
const tagSchema = z.string().min(1, 'Tag cannot be empty').max(20, 'Tag must be 20 characters or less')

export default function WorkflowHeader({ workflow }: { workflow: Doc<"workflows"> }) {
  const setWorkflowStarred = useMutation(api.data_functions.workflows.setWorkflowStarred)
  const addWorkflowTag = useMutation(api.data_functions.workflows.addWorkflowTag)
  const removeWorkflowTag = useMutation(api.data_functions.workflows.removeWorkflowTag)
  const editWorkflowTitle = useMutation(api.data_functions.workflows.editWorkflowTitle)
  const [newTag, setNewTag] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  
  // Get all workflows to extract tags
  const allWorkflows = useQuery(api.data_functions.workflows.listWorkflows)
  
  // Extract all unique tags from workflows
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    if (allWorkflows) {
      allWorkflows.forEach(workflow => {
        workflow.tags?.forEach(tag => tags.add(tag))
      })
    }
    return Array.from(tags).sort()
  }, [allWorkflows])

  let status;
  // If workflow is loading, show skeleton
  if (workflow === undefined) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="w-64 h-6" />
      </div>
    );
  } else {
    status = workflow.enabled ? "active" : "paused";
  }

  const handleStarToggle = async (isStarred: boolean) => {
    try {
      await setWorkflowStarred({ workflowId: workflow._id, starred: isStarred });
    } catch (error) {
      console.error('Failed to toggle workflow star:', error);
      toast.error('Failed to update workflow star status');
    }
  };

    const handleAddTag = async (tagToAdd?: string) => {
    const tag = tagToAdd || newTag.trim()
    if (!tag) return
    
    setIsAddingTag(true)
    try {
      const validatedTag = tagSchema.parse(tag)
      await addWorkflowTag({ workflowId: workflow._id, tag: validatedTag })
      if (!tagToAdd) {
        setNewTag('')
      }
      toast.success(`Tag "${validatedTag}" added to workflow`)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      } else {
        console.error('Failed to add tag to workflow:', error)
        toast.error('Failed to add tag to workflow')
      }
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

  const handleRemoveTag = async (tag: string) => {
    try {
      await removeWorkflowTag({ workflowId: workflow._id, tag })
      toast.success(`Tag "${tag}" removed from workflow`)
    } catch (error) {
      console.error('Failed to remove tag from workflow:', error)
      toast.error('Failed to remove tag from workflow')
    }
  }

  const handleTagToggle = async (e: React.MouseEvent, tag: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    const currentTags = workflow.tags || []
    const hasTag = currentTags.includes(tag)
    
    if (hasTag) {
      await handleRemoveTag(tag)
    } else {
      await handleAddTag(tag)
    }
  }

  const handleEditTitle = async (newTitle: string) => {
    try {
      await editWorkflowTitle({ workflowId: workflow._id, title: newTitle })
      toast.success('Workflow title updated')
    } catch (error) {
      console.error('Failed to update workflow title:', error)
      toast.error('Failed to update workflow title')
    }
  }

  return (
    <div className="flex items-center gap-4">

      <EditableText
        value={workflow.title}
        fallbackValue="Untitled Workflow"
        placeholder="Enter workflow title"
        elementType="h1"
        className="text-lg font-semibold"
        inputClassName="text-lg font-semibold"
        onSave={handleEditTitle}
      />
      <span className="text-sm bg-secondary rounded-full px-2 py-1">{status.charAt(0).toUpperCase() + status.slice(1)}</span>

      <StarToggle
        isStarred={workflow.starred}
        onToggle={handleStarToggle}
      />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {workflow.tags && workflow.tags.length > 0 && (
          <>
            {/* Show first 2 tags */}
            {workflow.tags.slice(0, 2).map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-secondary rounded-full flex items-center justify-between min-w-0">
                <span className="truncate">{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors flex-shrink-0"
                  title="Remove tag"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {/* Show "x other tags" if there are more than 3 tags */}
            {workflow.tags.length > 3 && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="px-2 py-1 bg-secondary rounded-full cursor-help">
                    {workflow.tags.length - 2} other tags
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-auto p-2">
                  <div className="flex flex-col gap-1">
                    {workflow.tags.slice(2).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-secondary rounded-full text-xs flex items-center justify-between min-w-0">
                        <span className="truncate">{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors flex-shrink-0"
                          title="Remove tag"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}

            {/* Show 3rd tag if there are exactly 3 tags */}
            {workflow.tags?.length === 3 && (
              <span className="px-2 py-1 bg-secondary rounded-full flex items-center justify-between min-w-0">
                <span className="truncate">{workflow.tags[2]}</span>
                <button
                  onClick={() => handleRemoveTag(workflow.tags![2])}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors flex-shrink-0"
                  title="Remove tag"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-secondary"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add a tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-2">
            <div className="space-y-2">
              {/* Existing tags */}
              {allTags.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 px-2 py-1">Available tags</div>
                  {allTags.map((tag: string) => {
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
                  onClick={() => handleAddTag()}
                  disabled={!newTag.trim() || isAddingTag}
                  className="w-full h-8"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {isAddingTag ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
'use client'

import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Id } from '@/../convex/_generated/dataModel'

export function useStepActions() {
  const editStepTitle = useMutation(api.data_functions.workflow_steps.editStepTitle)
  const editStepComment = useMutation(api.data_functions.workflow_steps.editStepComment)

  const handleEditStepTitle = async (
    workflowId: Id<'workflows'>,
    stepId: Id<'trigger_steps'> | Id<'action_steps'>,
    title: string | undefined
  ) => {
    if (!title || title.trim() === '') {
      title = ""
    }

    try {
      await editStepTitle({
        workflowId,
        stepId,
        title
      })
    } catch (error) {
      console.error('Failed to edit step title:', error)
      throw error
    }
  }

  const handleEditStepComment = async (
    workflowId: Id<'workflows'>,
    stepId: Id<'trigger_steps'> | Id<'action_steps'>,
    comment: string | undefined
  ) => {
    if (!comment || comment.trim() === '') {
      comment = ""
    }

    try {
      await editStepComment({
        workflowId,
        stepId,
        comment
      })
    } catch (error) {
      console.error('Failed to edit step comment:', error)
      throw error
    }
  }

  return {
    handleEditStepTitle,
    handleEditStepComment
  }
} 
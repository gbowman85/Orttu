'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { Id } from "@/../convex/_generated/dataModel"
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

// Define the schema for the form data validation
const triggerSchema = z.object({
    triggerKey: z.string().min(1, 'Please select a trigger')
})

type TriggerFormData = z.infer<typeof triggerSchema>

interface ChooseTriggerDialogProps {
    workflowId: Id<"workflows">
    children: React.ReactNode
}

// The dialog content for choosing a trigger
function ChooseTriggerDialogContent({ workflowId, onClose }: { workflowId: Id<"workflows">, onClose: () => void }) {
    const triggers = useQuery(api.data_functions.trigger_definitions.listTriggerDefinitions) || []
    const setTrigger = useMutation(api.data_functions.workflow_steps.setTrigger)
    const [formData, setFormData] = useState<TriggerFormData>({
        triggerKey: ''
    })
    const [errors, setErrors] = useState<Partial<TriggerFormData>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const validatedData = triggerSchema.parse(formData)
            setIsSubmitting(true)

            // Find the trigger definition by triggerKey
            const triggerDefinition = triggers.find(t => t.triggerKey === validatedData.triggerKey)
            if (!triggerDefinition) {
                throw new Error('Selected trigger not found')
            }

            // Set the trigger for the workflow
            await setTrigger({
                workflowId: workflowId,
                triggerDefinitionId: triggerDefinition._id
            })

            toast.success('Trigger selected successfully')
            onClose()
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Partial<TriggerFormData> = {}
                error.errors.forEach((err: z.ZodIssue) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as keyof TriggerFormData] = err.message
                    }
                })
                setErrors(fieldErrors)
                toast.error('Please select a trigger')
            } else {
                console.error('Unexpected error:', error)
                toast.error('An unexpected error occurred')
            }
            setIsSubmitting(false)
        }
    }

    return (
        <DialogContent className="fixed top-[25%]">
            <DialogHeader>
                <DialogTitle>Choose a trigger</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Choose a trigger */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">How do you want the workflow to start?</label>
                    <Select
                        value={formData.triggerKey}
                        onValueChange={(value) => {
                            setFormData((prev: TriggerFormData) => ({ ...prev, triggerKey: value }))
                            setErrors((prev: Partial<TriggerFormData>) => ({ ...prev, triggerKey: undefined }))
                        }}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger aria-invalid={!!errors.triggerKey} aria-label="Select a trigger">
                            <SelectValue placeholder="Select a trigger" />
                        </SelectTrigger>
                        <SelectContent>
                            {triggers.map((trigger) => (
                                <SelectItem key={trigger._id} value={trigger.triggerKey}>
                                    {trigger.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.triggerKey && (
                        <span className="text-sm text-destructive">{errors.triggerKey}</span>
                    )}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Setting trigger...' : 'Confirm'}
                </Button>
            </form>
        </DialogContent>
    )
}

// The main dialog component
export function ChooseTriggerDialog({ workflowId, children }: ChooseTriggerDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <ChooseTriggerDialogContent workflowId={workflowId} onClose={() => setIsOpen(false)} />
        </Dialog>
    )
} 
'use client'

import { Dialog, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const workflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  triggerKey: z.string().min(1, 'Please select a trigger')
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

export default function NewWorkflowDialog() {
    const router = useRouter()
    const triggers = useQuery(api.data_functions.trigger_definitions.listTriggerDefinitions)
    const createWorkflow = useMutation(api.data_functions.workflows.createWorkflow)
    const [formData, setFormData] = useState<WorkflowFormData>({
        name: '',
        triggerKey: ''
    });
    const [errors, setErrors] = useState<Partial<WorkflowFormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const validatedData = workflowSchema.parse(formData);
            setIsSubmitting(true);
            
            // Create the workflow
            const workflowId = await createWorkflow({ title: validatedData.name, triggerKey: validatedData.triggerKey });
            
            // Redirect to the edit page
            router.push(`/w/${workflowId}/edit`);
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Partial<WorkflowFormData> = {};
                error.errors.forEach((err: z.ZodIssue) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as keyof WorkflowFormData] = err.message;
                    }
                });
                setErrors(fieldErrors);
                toast.error('Please fill in all required fields');
            } else {
                // Handle other types of errors
                console.error('Unexpected error:', error);
                toast.error('An unexpected error occurred');
            }
            setIsSubmitting(false);
        }
    };

    return (
    <Dialog>
        <DialogTrigger asChild>
            <Button className="mb-4">
                <PlusIcon className="w-4 h-4" />
                New workflow
            </Button>
        </DialogTrigger>

        <DialogContent className="fixed top-[25%]">
            <DialogHeader>
                <DialogTitle>New workflow</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Workflow name</Label>
                    <Input 
                        placeholder="Enter a name for your workflow"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData((prev: WorkflowFormData) => ({ ...prev, name: e.target.value }))
                            setErrors((prev: Partial<WorkflowFormData>) => ({ ...prev, name: undefined }))
                        }}
                        aria-invalid={!!errors.name}
                        disabled={isSubmitting}
                    />
                    {errors.name && (
                        <span className="text-sm text-destructive">{errors.name}</span>
                    )}
                </div>
                {/* Choose a trigger */}
                <div className="flex flex-col gap-2">
                    <Label>How do you want the workflow to start?</Label>
                    <Select
                        value={formData.triggerKey}
                        onValueChange={(value) => {
                            setFormData((prev: WorkflowFormData) => ({ ...prev, triggerKey: value }))
                            setErrors((prev: Partial<WorkflowFormData>) => ({ ...prev, triggerKey: undefined }))
                        }}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger aria-invalid={!!errors.triggerKey}>
                            <SelectValue placeholder="Select a trigger" />
                        </SelectTrigger>
                        <SelectContent>
                            {triggers?.map((trigger) => (
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
                    {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
            </form>
        </DialogContent>
    </Dialog>
    )
}
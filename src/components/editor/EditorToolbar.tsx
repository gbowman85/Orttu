'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlaskConical } from "lucide-react"
import { BackToWorkflowsButton } from "./BackToWorkflowsButton"
import { useWorkflowData } from "@/hooks/useWorkflowData"
import { useWorkflowEditor } from "@/contexts/WorkflowEditorContext"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useParams } from "next/navigation"
import { TestWorkflowDialog } from "@/components/editor/TestWorkflowDialog"

export default function EditorToolbar() {
    const { workflow } = useWorkflowData()
    const { currentTab, setCurrentTab } = useWorkflowEditor()
    const pathname = usePathname()
    const router = useRouter()
    const params = useParams()
    const workflowId = params.workflowId as string
    const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)

    const isEnabled = workflow?.enabled ?? false

    // Update tab based on pathname when component mounts or pathname changes
    useEffect(() => {
        setCurrentTab(pathname.includes('/activity') ? 'activity' : 'editor')
    }, [pathname, setCurrentTab])

    const handleTabChange = (value: string) => {
        setCurrentTab(value as 'editor' | 'activity')
        
        // Update URL without causing a page reload
        if (value === 'activity') {
            router.push(`/w/${workflowId}/activity`, { scroll: false })
        } else {
            router.push(`/w/${workflowId}/edit`, { scroll: false })
        }
    }

    return (
        <>
            <div id="editor-toolbar" className="flex items-center justify-between w-full px-3 mb-2">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <BackToWorkflowsButton />
                    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="editor">
                                Editor
                            </TabsTrigger>
                            <TabsTrigger value="activity">
                                Activity
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Right side - Controls */}
                <div className="flex items-center gap-4 px-4">
                    <Button onClick={() => setIsTestDialogOpen(true)}>
                        <FlaskConical className="mr-2 h-4 w-4" />
                        Test
                    </Button>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                        <span className="text-sm">Enable</span>
                        <Switch checked={isEnabled} onCheckedChange={() => {}} />
                    </div>
                </div>
            </div>
            
            {/* Test Workflow Dialog */}
            {workflow?._id && workflow?.title && (
                <TestWorkflowDialog
                    workflowId={workflow._id}
                    workflowTitle={workflow.title}
                    isOpen={isTestDialogOpen}
                    onClose={() => setIsTestDialogOpen(false)}
                />
            )}
        </>
    )
} 
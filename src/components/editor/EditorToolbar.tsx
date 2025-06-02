'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlaskConical } from "lucide-react"

export default function EditorToolbar() {

    return (
        <div className="flex items-center justify-between w-full">
            {/* Left side - Tabs */}
            <Tabs defaultValue="editor" className="w-[400px]">
                <TabsList>
                        <TabsTrigger value="editor">
                            Editor
                        </TabsTrigger>
                        <TabsTrigger value="activity">
                            Activity
                        </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Right side - Controls */}
            <div className="flex items-center gap-4 px-4">
                <Button><FlaskConical />Test</Button>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                    <span className="text-sm">Enable</span>
                    <Switch />
                </div>
            </div>
        </div>
    )
} 
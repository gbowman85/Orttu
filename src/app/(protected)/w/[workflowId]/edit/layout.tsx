'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import EditorSidebar from "@/components/editor/EditorSidebar";
import Link from "next/link";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div id="editor-container" className="flex flex-col flex-1 gap-4">
            <ResizablePanelGroup direction="horizontal" autoSaveId="workflow-editor" className="flex-1" style={{ minWidth: '180px' }}>
                <ResizablePanel defaultSize={15 } className="min-w-[180px] max-w-[300px]">
                    <div
                        id="sidebar"
                        className="flex flex-col h-full pt-4 pl-3 pr-1 relative min-h-0"
                    >
                        {/* Back to Dashboard button */}
                        <Button className="mb-4" variant="outline" asChild>
                            <Link href="/workflows">
                                <ChevronLeft />
                                Dashboard
                            </Link>
                        </Button>
                        
                        {/* Editor Sidebar */}
                        <EditorSidebar />
                    </div>
                </ResizablePanel>
                <ResizableHandle className="w-2 rounded-sm bg-transparent hover:bg-gray-200 transition-colors" />
                <ResizablePanel defaultSize={85} className="mb-4 mr-4">
                    {/* Workflow Canvas */}
                    <div id="canvas" className="flex flex-col w-full h-full bg-white rounded-md p-4 min-h-0">
                        {children}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
} 
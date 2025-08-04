'use client'

import { useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CommentIconProps {
    comment: string | null
    className?: string
    textPosition?: 'before' | 'after'
}

export function CommentIcon({ comment, className = '' }: CommentIconProps) {

    if (!comment) return null

    return (
        <div className={`flex justify-center ${className}`}>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-gray-300/50 cursor-help"
                    >
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                    <div className="text-sm">{comment}</div>
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}
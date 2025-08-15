import React from 'react'
import { Button } from './button'
import { ExternalLink } from 'lucide-react'

interface DescriptionWithButtonProps {
    description: string
    className?: string
}

// Helper function to replace documentation links with React button elements
function replaceDocumentationLinks(description: string, className?: string): React.ReactNode[] {
    if (!description) return []
    
    // Regex to match markdown links that contain "documentation" or "docs" (case insensitive)
    const docLinkRegex = /\[([^\]]*[Dd]ocumentation[^\]]*|[^\]]*[Dd]ocs[^\]]*)\]\(([^)]+)\)/g
    
    const elements: React.ReactNode[] = []
    let lastIndex = 0
    let match
    
    while ((match = docLinkRegex.exec(description)) !== null) {
        // Add text before the match
        const textBefore = description.slice(lastIndex, match.index)
        if (textBefore) {
            // Remove "for more information" that might precede the docs link
            const cleanedText = textBefore.replace(/\s*for more information\s*$/i, '')
            if (cleanedText) {
                elements.push(
                    <span key={`text-${lastIndex}`} className={className}>
                        {cleanedText}
                    </span>
                )
            }
        }
        
        // Add the button
        const url = match[2]
        elements.push(
            <React.Fragment key={`button-${match.index}`}>
                <br />
                <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-1 ml-0 mt-2 text-xs"
                    onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                >
                    Documentation
                    <ExternalLink className="h-3 w-3" />
                </Button>
            </React.Fragment>
        )
        
        lastIndex = match.index + match[0].length
    }
    
    // Add remaining text after the last match
    const remainingText = description.slice(lastIndex)
    if (remainingText) {
        elements.push(
            <span key={`text-${lastIndex}`} className={className}>
                {remainingText}
            </span>
        )
    }
    
    return elements
}

export function DescriptionWithButton({ description, className }: DescriptionWithButtonProps) {
    if (!description) return null

    // Process the description to replace documentation links with buttons
    const elements = replaceDocumentationLinks(description, className)

    // If no documentation links were found, return the description as plain text
    if (elements.length === 0) {
        return <span className={className}>{description}</span>
    }

    return <>{elements}</>
}

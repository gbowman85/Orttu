import { Star } from 'lucide-react'
import { Button } from './button'

interface StarToggleProps {
    isStarred: boolean
    onToggle: (isStarred: boolean) => void
    className?: string
}

export function StarToggle({ 
    isStarred, 
    onToggle, 
    className = '' 
}: StarToggleProps) {
    const handleClick = () => {
        onToggle(!isStarred)
    }

    return (
        <Button
            variant="link"
            size="sm"
            onClick={handleClick}
            className={`group h-8 w-8 p-0 rounded-full hover:bg-gray-50 ${className}`}
        >
            {isStarred ? (
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 group-hover:fill-gray-200" />
            ) : (
                <Star className="h-4 w-4 text-gray-400 fill-none group-hover:fill-yellow-200" />
            )}
        </Button>
    )
} 
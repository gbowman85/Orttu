'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AddActionButtonProps {
  onClick?: () => void
  className?: string
}

export default function AddActionButton({ onClick, className }: AddActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`group w-8 h-8 rounded-full border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 ${className}`}
    >
      <Plus className="h-4 w-4 text-gray-200 group-hover:text-gray-800 transition-colors duration-200" />
    </Button>
  )
} 
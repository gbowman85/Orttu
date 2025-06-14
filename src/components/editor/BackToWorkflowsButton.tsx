import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function BackToWorkflowsButton() {
  return (
    <Button variant="outline" asChild>
      <Link href="/workflows">
        <ChevronLeft className="w-4 h-4" />
        Back to Workflows
      </Link>
    </Button>
  )
} 
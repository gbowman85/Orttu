'use client'

interface ActionCardProps {
  title: string
  description: string
}

export default function ActionCard({ title, description }: ActionCardProps) {
  return (
    <div className="w-90 border-4 border-gray-200 border-dashed rounded-3xl p-4 text-center text-muted-foreground">
        <div className="text-lg font-bold">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
    </div>
    
  )
}
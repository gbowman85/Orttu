'use client'

interface ActionCardProps {
  title: string
  description: string
  borderColour?: string
  bgColour?: string
  textColour?: string
}

export default function ActionCard({ title, description, borderColour, bgColour, textColour }: ActionCardProps) {
  return (
    <div className="w-90 border-4 border-gray-200 rounded-3xl p-4 text-center text-muted-foreground"
      style={{
        backgroundColor: bgColour,
        borderColor: borderColour,
        color: textColour
      }}
    >
        <div className="text-lg font-bold">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
    </div>
    
  )
}
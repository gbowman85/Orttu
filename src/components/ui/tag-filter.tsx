import { Check, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface TagFilterProps {
  allTags: string[]
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  onTagRemove: (tag: string) => void
}

export function TagFilter({ allTags, selectedTags, onTagSelect, onTagRemove }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-8 border-dashed">
            Add filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {allTags.map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => onTagSelect(tag)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedTags.includes(tag) ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {tag}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {tag}
          <button
            type="button"
            onClick={() => onTagRemove(tag)}
            className="flex items-center justify-center"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
} 
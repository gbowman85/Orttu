"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  value?: Date | string
  onChange?: (date: Date | undefined) => void
  showTime?: boolean
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", className, showTime = false }: DatePickerProps) {
  // Convert string date to Date object if needed
  const dateValue = value ? (typeof value === 'string' ? new Date(value) : value) : undefined
  const [timeValue, setTimeValue] = React.useState<string>(
    dateValue ? format(dateValue, 'HH:mm') : '10:00'
  )

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTimeValue(newTime)
    
    if (dateValue) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDate = new Date(dateValue)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      onChange?.(newDate)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date && timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number)
      date.setHours(hours)
      date.setMinutes(minutes)
    }
    onChange?.(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateValue && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? (
            <span>
              {format(dateValue, showTime ? "PPP p" : "PPP")}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col gap-2 p-3">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleDateSelect}
            initialFocus
          />
          {showTime && (
            <div className="flex justify-center items-center gap-2 border-t pt-2">
              <Input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className="w-[120px]"
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
} 
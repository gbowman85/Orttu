'use client'

import { createContext, useContext, ReactNode, useState, useCallback } from 'react'

type HeaderSlots = {
  afterLogo?: ReactNode
}

type HeaderSlotContextType = {
  slots: HeaderSlots
  setSlot: (slot: keyof HeaderSlots, content: ReactNode) => void
  clearSlot: (slot: keyof HeaderSlots) => void
}

const HeaderSlotContext = createContext<HeaderSlotContextType | null>(null)

export function HeaderSlotProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<HeaderSlots>({})

  const setSlot = useCallback((slot: keyof HeaderSlots, content: ReactNode) => {
    setSlots(prev => ({ ...prev, [slot]: content }))
  }, [])

  const clearSlot = useCallback((slot: keyof HeaderSlots) => {
    setSlots(prev => {
      const next = { ...prev }
      delete next[slot]
      return next
    })
  }, [])

  return (
    <HeaderSlotContext.Provider value={{ slots, setSlot, clearSlot }}>
      {children}
    </HeaderSlotContext.Provider>
  )
}

export function useHeaderSlot() {
  const context = useContext(HeaderSlotContext)
  if (!context) {
    throw new Error('useHeaderSlot must be used within a HeaderSlotProvider')
  }
  return context
} 
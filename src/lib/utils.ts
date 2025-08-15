import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a lighter version of a hex color by mixing it with white
 * @param hexColor - The hex color to lighten (with or without #)
 * @param lightness - How much to lighten (0-1, where 0 is no change, 1 is pure white)
 * @returns The lighter hex color
 */
export function reduceColour(hexColor: string, lightness: number = 0.5): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Parse the hex color
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Mix with white based on lightness
  const newR = Math.round(r + (255 - r) * lightness)
  const newG = Math.round(g + (255 - g) * lightness)
  const newB = Math.round(b + (255 - b) * lightness)
  
  // Convert back to hex
  const newHex = '#' + 
    newR.toString(16).padStart(2, '0') +
    newG.toString(16).padStart(2, '0') +
    newB.toString(16).padStart(2, '0')
  
  return newHex
}

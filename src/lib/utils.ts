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

/**
 * Inserts text at the current cursor position in the focused text input
 * @param text - The text to insert
 * @param targetElement - Optional specific element to insert into (defaults to active element)
 */
export function insertTextAtCursor(text: string, targetElement?: Element): boolean {
  const activeElement = targetElement || document.activeElement
  
  if (!activeElement) {
    return false
  }

  // Check if the active element is inside a MentionsInput component
  const mentionsInputContainer = activeElement.closest('[data-mentions-input]')
  if (mentionsInputContainer) {
    // Check if this MentionsInput is registered
    const insertTextFn = (window as unknown as { __mentionsInputRegistry?: Map<Element, (text: string) => void> }).__mentionsInputRegistry?.get(mentionsInputContainer)
    if (insertTextFn) {
      insertTextFn(text)
      return true
    }
  }

  // Handle input and textarea elements
  if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
    const input = activeElement as HTMLInputElement | HTMLTextAreaElement
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0
    const value = input.value
    
    // Insert the text at cursor position
    input.value = value.substring(0, start) + text + value.substring(end)
    
    // Set cursor position after the inserted text
    const newCursorPos = start + text.length
    input.setSelectionRange(newCursorPos, newCursorPos)
    
    // Trigger input event to notify React of the change
    input.dispatchEvent(new Event('input', { bubbles: true }))
    return true
  }
  
  // Handle contenteditable elements
  if (activeElement.getAttribute('contenteditable') === 'true') {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      
      // Move cursor after inserted text
      range.setStart(range.endContainer, range.endOffset)
      range.setEnd(range.endContainer, range.endOffset)
      selection.removeAllRanges()
      selection.addRange(range)
      
      // Trigger input event
      activeElement.dispatchEvent(new Event('input', { bubbles: true }))
      return true
    }
  }
  
  return false
}

import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function to merge Tailwind CSS classes and handle conditional classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

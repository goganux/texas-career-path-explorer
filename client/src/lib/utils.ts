import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency - used for salary display
export function formatCurrency(value: string): string {
  return value;
}

// Determine status color classes based on path status
export function getStatusBadgeClasses(status: string): { bg: string; text: string } {
  switch (status) {
    case 'completed':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'in-progress':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'available':
      return { bg: 'bg-neutral-100', text: 'text-neutral-600' };
    case 'eligible':
      return { bg: 'bg-neutral-100', text: 'text-neutral-600' };
    case 'recommended':
      return { bg: 'bg-amber-100', text: 'text-amber-800' };
    case 'option':
      return { bg: 'bg-neutral-100', text: 'text-neutral-600' };
    default:
      return { bg: 'bg-neutral-100', text: 'text-neutral-600' };
  }
}

// Convert camelCase to Title Case
export function toTitleCase(str: string): string {
  // Add space before capital letters and uppercase the first letter
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '…' : text
}

export function calculateDiscount(price: number, comparePrice: number | null): number | null {
  if (!comparePrice || comparePrice <= price) return null
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Awaiting Payment',
    PAID: 'Paid',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  }
  return labels[status] ?? status
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] ?? 'bg-gray-100 text-gray-800'
}

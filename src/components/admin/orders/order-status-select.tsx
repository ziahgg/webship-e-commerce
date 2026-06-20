'use client'

import { useState } from 'react'

const STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const
type Status = typeof STATUSES[number]

const LABELS: Record<Status, string> = {
  PENDING: 'Awaiting Payment',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

const COLORS: Record<Status, string> = {
  PENDING: 'text-yellow-600',
  PAID: 'text-blue-600',
  PROCESSING: 'text-purple-600',
  SHIPPED: 'text-indigo-600',
  DELIVERED: 'text-green-600',
  CANCELLED: 'text-red-500',
}

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus as Status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleChange(next: Status) {
    if (next === status) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      setStatus(next)
    } catch {
      setError('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as Status)}
        disabled={saving}
        className={`input-base max-w-[180px] font-medium ${COLORS[status]}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{LABELS[s]}</option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

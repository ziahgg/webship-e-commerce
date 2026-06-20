'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface DayData {
  date: string
  revenue: number
}

export function SalesChart({ data }: { data: DayData[] }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold mb-4">Sales — Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => {
              const d = new Date(v)
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `$${v}`}
            width={52}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
            }
          />
          <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

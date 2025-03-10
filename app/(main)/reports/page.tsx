"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Calculation {
  id: number
  type: string
  date: string
  inputs: {
    revenue?: number
    costOfGoodsSold?: number
  }
  results: {
    grossProfit?: number
    profitMargin?: number
  }
}

export default function ReportsPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        const response = await fetch('/api/calculations')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error: ${response.status}`)
        }
        const data = await response.json()
        setCalculations(data)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load calculations')
      } finally {
        setLoading(false)
      }
    }

    fetchCalculations()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan Perhitungan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calculations.map((calc) => (
            <div key={calc.id} className="border p-4 rounded-lg">
              <div>Tanggal: {new Date(calc.date).toLocaleDateString('id-ID')}</div>
              <div>Tipe: {calc.type}</div>
              <div>Pendapatan: {formatCurrency(calc.inputs.revenue || 0)}</div>
              <div>HPP: {formatCurrency(calc.inputs.costOfGoodsSold || 0)}</div>
              <div>Laba Kotor: {formatCurrency(calc.results.grossProfit || 0)}</div>
              <div>Margin: {calc.results.profitMargin?.toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 

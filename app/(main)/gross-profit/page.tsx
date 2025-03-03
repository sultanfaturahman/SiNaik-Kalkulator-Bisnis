"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GrossProfitCalculator() {
  const [revenue, setRevenue] = useState("")
  const [costOfGoodsSold, setCostOfGoodsSold] = useState("")
  const [grossProfit, setGrossProfit] = useState<number | null>(null)
  const [profitMargin, setProfitMargin] = useState<number | null>(null)

  const calculateGrossProfit = async (e: React.FormEvent) => {
    e.preventDefault()
    const revenueNum = parseFloat(revenue)
    const costNum = parseFloat(costOfGoodsSold)
    
    const profit = revenueNum - costNum
    const margin = (profit / revenueNum) * 100

    setGrossProfit(profit)
    setProfitMargin(margin)

    // Save calculation
    try {
      await fetch('/api/calculations', {
        method: 'POST',
        body: JSON.stringify({
          type: 'gross-profit',
          inputs: { revenue: revenueNum, costOfGoodsSold: costNum },
          results: { grossProfit: profit, profitMargin: margin },
          userId: 'user-id-here' // Replace with actual user ID from auth
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Error saving calculation:', error)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kalkulator Laba Kotor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={calculateGrossProfit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="revenue" className="text-sm font-medium leading-none">
              Pendapatan
            </label>
            <Input
              id="revenue"
              type="number"
              placeholder="Masukan Pendapatan"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="cogs" className="text-sm font-medium leading-none">
              Harga Pokok Penjualan
            </label>
            <Input
              id="cogs"
              type="number"
              placeholder="Masukan HPP"
              value={costOfGoodsSold}
              onChange={(e) => setCostOfGoodsSold(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Hitung
          </Button>
        </form>

        {grossProfit !== null && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Laba Kotor:</span>
              <span>Rp{grossProfit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Margin Laba:</span>
              <span>{profitMargin?.toFixed(2)}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
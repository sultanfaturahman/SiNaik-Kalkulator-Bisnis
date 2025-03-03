"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PricePerUnitCalculator() {
  const [totalCost, setTotalCost] = useState("")
  const [numberOfUnits, setNumberOfUnits] = useState("")
  const [desiredProfit, setDesiredProfit] = useState("")
  const [pricePerUnit, setPricePerUnit] = useState<number | null>(null)

  const calculatePricePerUnit = () => {
    const cost = Number.parseFloat(totalCost)
    const units = Number.parseFloat(numberOfUnits)
    const profit = Number.parseFloat(desiredProfit)

    if (isNaN(cost) || isNaN(units) || isNaN(profit) || units === 0) {
      alert("Please enter valid numbers")
      return
    }

    const price = (cost + profit) / units
    setPricePerUnit(price)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kalkulator Harga Per-Unit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700">
              Total Biaya
            </label>
            <Input
              id="totalCost"
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="Masukan Total Biaya"
            />
          </div>
          <div>
            <label htmlFor="numberOfUnits" className="block text-sm font-medium text-gray-700">
              Jumlah Unit
            </label>
            <Input
              id="numberOfUnits"
              type="number"
              value={numberOfUnits}
              onChange={(e) => setNumberOfUnits(e.target.value)}
              placeholder="Masukan Jumlah Unit"
            />
          </div>
          <div>
            <label htmlFor="desiredProfit" className="block text-sm font-medium text-gray-700">
              Laba Yang Diinginkan
            </label>
            <Input
              id="desiredProfit"
              type="number"
              value={desiredProfit}
              onChange={(e) => setDesiredProfit(e.target.value)}
              placeholder="Masukan Laba Yang Diinginkan"
            />
          </div>
          <Button onClick={calculatePricePerUnit}>Hitung</Button>
          {pricePerUnit !== null && (
            <div className="mt-4">
              <p>Harga Per Unit: Rp{pricePerUnit.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


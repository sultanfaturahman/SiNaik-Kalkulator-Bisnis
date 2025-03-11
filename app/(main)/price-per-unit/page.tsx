"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah, parseRupiah } from "@/lib/utils"

export default function PricePerUnitCalculator() {
  const [totalCost, setTotalCost] = useState("")
  const [numberOfUnits, setNumberOfUnits] = useState("")
  const [desiredProfit, setDesiredProfit] = useState("")
  const [pricePerUnit, setPricePerUnit] = useState<number | null>(null)

  const calculatePricePerUnit = () => {
    const cost = Number(parseRupiah(totalCost))
    const units = Number(numberOfUnits)
    const profit = Number(parseRupiah(desiredProfit))

    if (isNaN(cost) || isNaN(units) || isNaN(profit) || units === 0) {
      alert("Mohon masukan angka yang valid")
      return
    }

    const price = (cost + profit) / units
    setPricePerUnit(price)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="totalCost" className="block text-sm font-medium">
              Total Biaya
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="totalCost"
                type="text"
                value={formatRupiah(totalCost)}
                onChange={(e) => setTotalCost(parseRupiah(e.target.value))}
                placeholder="Masukan Total Biaya"
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <label htmlFor="numberOfUnits" className="block text-sm font-medium">
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
            <label htmlFor="desiredProfit" className="block text-sm font-medium">
              Laba Yang Diinginkan
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="desiredProfit"
                type="text"
                value={formatRupiah(desiredProfit)}
                onChange={(e) => setDesiredProfit(parseRupiah(e.target.value))}
                placeholder="Masukan Laba Yang Diinginkan"
                className="pl-12"
              />
            </div>
          </div>

          <Button onClick={calculatePricePerUnit}>Hitung</Button>

          {pricePerUnit !== null && (
            <div className="mt-4">
              <p className="flex justify-between">
                <span>Harga Per Unit:</span>
                <span>Rp {formatRupiah(pricePerUnit)}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


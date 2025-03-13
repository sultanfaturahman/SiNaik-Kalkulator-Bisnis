"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah, parseRupiah } from "@/lib/utils"

const ExportButtons = () => {
  return (
    <div className="flex gap-2 mt-4">
      <Button 
        variant="default" 
        className="bg-gray-900 hover:bg-gray-800 text-white"
        onClick={() => handlePdfExport()}
      >
        Export PDF
      </Button>
      <Button 
        variant="default" 
        className="bg-gray-900 hover:bg-gray-800 text-white"
        onClick={() => handleCsvExport()}
      >
        Export CSV
      </Button>
    </div>
  )
}

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("")
  const [targetProfit, setTargetProfit] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [recommendedDiscount, setRecommendedDiscount] = useState<number | null>(null)
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const [profitAfterDiscount, setProfitAfterDiscount] = useState<number | null>(null)

  const calculateOptimalDiscount = () => {
    const price = Number(parseRupiah(originalPrice))
    const cost = Number(parseRupiah(costPrice))
    const desiredProfit = Number(parseRupiah(targetProfit))

    if (isNaN(price) || isNaN(cost) || isNaN(desiredProfit)) {
      alert("Mohon masukan angka yang valid")
      return
    }

    if (cost >= price) {
      alert("Harga jual harus lebih tinggi dari harga modal")
      return
    }

    // Calculate maximum possible discount while maintaining target profit
    const maxDiscountAmount = price - (cost + desiredProfit)
    const maxDiscountPercentage = (maxDiscountAmount / price) * 100

    // Round down to nearest whole number for cleaner display
    const recommendedDiscountPercentage = Math.floor(maxDiscountPercentage)
    const discountAmount = price * (recommendedDiscountPercentage / 100)
    const finalSellingPrice = price - discountAmount
    const actualProfit = finalSellingPrice - cost

    setRecommendedDiscount(recommendedDiscountPercentage)
    setFinalPrice(finalSellingPrice)
    setProfitAfterDiscount(actualProfit)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kalkulator Diskon Optimal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="costPrice" className="block text-sm font-medium">
              Harga Modal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="costPrice"
                type="text"
                value={formatRupiah(costPrice)}
                onChange={(e) => setCostPrice(parseRupiah(e.target.value))}
                placeholder="Masukan Harga Modal"
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium">
              Harga Normal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="originalPrice"
                type="text"
                value={formatRupiah(originalPrice)}
                onChange={(e) => setOriginalPrice(parseRupiah(e.target.value))}
                placeholder="Masukan Harga Normal"
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <label htmlFor="targetProfit" className="block text-sm font-medium">
              Target Keuntungan Minimal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="targetProfit"
                type="text"
                value={formatRupiah(targetProfit)}
                onChange={(e) => setTargetProfit(parseRupiah(e.target.value))}
                placeholder="Masukan Target Keuntungan"
                className="pl-12"
              />
            </div>
          </div>

          <Button onClick={calculateOptimalDiscount} className="w-full mb-4">
            Hitung Diskon Optimal
          </Button>

          {recommendedDiscount !== null && (
            <>
              <div className="mt-4 space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Diskon Optimal:</span>
                  <span>{recommendedDiscount}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Harga Setelah Diskon:</span>
                  <span>Rp {formatRupiah(finalPrice!)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Keuntungan Akhir:</span>
                  <span>Rp {formatRupiah(profitAfterDiscount!)}</span>
                </div>
              </div>
              <ExportButtons />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function handlePdfExport() {
  // Implement PDF export logic here
  console.log("Exporting to PDF...")
}

function handleCsvExport() {
  // Implement CSV export logic here
  console.log("Exporting to CSV...")
}


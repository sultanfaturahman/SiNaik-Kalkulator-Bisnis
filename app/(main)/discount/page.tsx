"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountPercentage, setDiscountPercentage] = useState("")
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null)
  const [savings, setSavings] = useState<number | null>(null)

  const calculateDiscount = () => {
    const price = Number.parseFloat(originalPrice)
    const discount = Number.parseFloat(discountPercentage)

    if (isNaN(price) || isNaN(discount)) {
      alert("Please enter valid numbers")
      return
    }

    const discountAmount = price * (discount / 100)
    const finalPrice = price - discountAmount

    setDiscountedPrice(finalPrice)
    setSavings(discountAmount)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kalkulator Diskon</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
              Harga Awal
            </label>
            <Input
              id="originalPrice"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Masukan Harga Awal"
            />
          </div>
          <div>
            <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
              Persentase Diskon
            </label>
            <Input
              id="discountPercentage"
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="Masukan Persentase Diskon"
            />
          </div>
          <Button onClick={calculateDiscount}>Hitung</Button>
          {discountedPrice !== null && savings !== null && (
            <div className="mt-4">
              <p>Harga Setelah Diskon: Rp{discountedPrice.toFixed(2)}</p>
              <p>Anda Menghemat: Rp{savings.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


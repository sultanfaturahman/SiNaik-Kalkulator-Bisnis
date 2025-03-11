"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah, parseRupiah } from "@/lib/utils"

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountPercentage, setDiscountPercentage] = useState("")
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null)
  const [savings, setSavings] = useState<number | null>(null)

  const calculateDiscount = () => {
    const price = Number(parseRupiah(originalPrice))
    const discount = Number(discountPercentage)

    if (isNaN(price) || isNaN(discount)) {
      alert("Mohon masukan angka yang valid")
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
            <label htmlFor="originalPrice" className="block text-sm font-medium">
              Harga Awal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="originalPrice"
                type="text"
                value={formatRupiah(originalPrice)}
                onChange={(e) => setOriginalPrice(parseRupiah(e.target.value))}
                placeholder="Masukan Harga Awal"
                className="pl-12"
              />
            </div>
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
          {discountedPrice !== null && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Harga Setelah Diskon:</span>
                <span>Rp {formatRupiah(discountedPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Penghematan:</span>
                <span>Rp {formatRupiah(savings!)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


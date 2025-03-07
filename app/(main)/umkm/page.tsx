"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UmkmPage() {
  const [grossProfit, setGrossProfit] = useState<string>("")
  const [category, setCategory] = useState('')

  const formatNumber = (value: string): string => {
    const number = Number(value.replace(/\D/g, ''));
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/umkm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grossProfit: grossProfit.replace(/\./g, '') }), // Send as a plain number
    });

    const data = await response.json();
    if (data.category) {
      setCategory(data.category);
    } else {
      setCategory('Error determining category');
    }
  }

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Kalkulator Status UMKM</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="grossProfit" className="text-sm font-medium leading-none">
                Total Laba Kotor (Rp):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500">Rp</span>
                <Input
                  id="grossProfit"
                  type="text" // Change to text to allow formatting
                  placeholder="Masukan Total Laba Kotor selama 3 bulan"
                  value={formatNumber(grossProfit)} // Format the displayed value
                  onChange={(e) => setGrossProfit(e.target.value)} // Keep the raw input
                  required
                  className="pl-9" // Add padding to the left to accommodate the symbol
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
          {category && <p>Kategori: {category}</p>}
        </CardContent>
      </Card>
    </>
  )
}

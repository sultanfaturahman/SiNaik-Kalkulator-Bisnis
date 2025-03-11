"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UmkmPage() {
  const [category, setCategory] = useState('')
  const [monthlyTotal, setMonthlyTotal] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<'exact' | 'period'>('exact')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('3')

  useEffect(() => {
    fetchMonthlyTotal()
  }, [selectedMonth, selectedPeriod, filterType])

  const fetchMonthlyTotal = async () => {
    try {
      let url = '/api/calculations?type=kalkulator-laba-kotor-harian&summary'
      
      if (filterType === 'exact') {
        if (selectedMonth) {
          url += `&month=${selectedMonth}`
        }
      } else {
        // Period filter
        const months = parseInt(selectedPeriod)
        const endDate = new Date()
        const startDate = new Date()
        startDate.setMonth(endDate.getMonth() - months)
        
        url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.length > 0) {
        const total = data.reduce(
          (acc: number, entry: any) => acc + entry.results.grossProfit,
          0
        )
        setMonthlyTotal(total)
        determineUmkmCategory(total)
      } else {
        setMonthlyTotal(0)
        setCategory('')
      }
    } catch (error) {
      console.error("Error fetching monthly total:", error)
    }
  }

  const determineUmkmCategory = (total: number) => {
    // Convert monthly total to yearly estimation for period filters
    let annualizedTotal = total
    if (filterType === 'period') {
      const monthsInPeriod = parseInt(selectedPeriod)
      annualizedTotal = (total / monthsInPeriod) * 12
    }

    let category = ''
    if (annualizedTotal < 30000000) {
      category = 'UMKM Ultra Mikro'
    } else if (annualizedTotal <= 60000000) {
      category = 'UMKM Super Mikro'
    } else if (annualizedTotal <= 167000000) {
      category = 'UMKM Mikro'
    } else {
      category = 'Laba kotor melebihi batas UMKM Mikro'
    }
    setCategory(category)
  }

  const getAvailableMonths = () => {
    const months = []
    const currentDate = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
      months.push({ value, label })
    }
    return months
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Status UMKM</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Jenis Filter</label>
            <Select
              value={filterType}
              onValueChange={(value: 'exact' | 'period') => {
                setFilterType(value)
                setSelectedMonth('')
                setSelectedPeriod('3')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Bulan Tertentu</SelectItem>
                <SelectItem value="period">Periode Waktu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filterType === 'exact' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Pilih Bulan</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableMonths().map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Pilih Periode</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Bulan Terakhir</SelectItem>
                  <SelectItem value="6">6 Bulan Terakhir</SelectItem>
                  <SelectItem value="12">1 Tahun Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {monthlyTotal === null ? (
          <div className="text-center py-4 text-gray-500">
            Memuat data...
          </div>
        ) : monthlyTotal === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Belum ada data laba kotor untuk periode yang dipilih
          </div>
        ) : (
          <div className="p-4 bg-gray-100 rounded space-y-4">
            <div>
              <h3 className="font-semibold">Total Laba Kotor:</h3>
              <p className="text-lg">
                Rp {new Intl.NumberFormat('id-ID').format(monthlyTotal)}
              </p>
            </div>
            {filterType === 'period' && (
              <div>
                <h3 className="font-semibold">Estimasi Laba Kotor Tahunan:</h3>
                <p className="text-lg">
                  Rp {new Intl.NumberFormat('id-ID').format((monthlyTotal / parseInt(selectedPeriod)) * 12)}
                </p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Kategori UMKM:</h3>
              <p className="text-lg">{category}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

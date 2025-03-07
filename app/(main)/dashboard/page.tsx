import Link from "next/link"
import Head from "next/head" // Import Head component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Percent, HandCoinsIcon, DiffIcon, Store } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kalkulator Laba Kotor</CardTitle>
            <DiffIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Hitung laba kotor per-hari
            </div>
            <Link 
              href="/gross-profit"
              className="absolute inset-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="sr-only">Kalkulator Laba Kotor</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perhitungan Harga Jual Per-Item</CardTitle>
            <HandCoinsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Menentukan Harga Jual Yang Optimal
            </div>
            <Link 
              href="/price-per-unit"
              className="absolute inset-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="sr-only">Kalkulator Harga Jual Per-Item</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kalkulator Diskon</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Kalkulasi Diskon yang Akurat
            </div>
            <Link 
              href="/discount"
              className="absolute inset-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="sr-only">Kalkulator Diskon Akurat</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UMKM Category</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Input laba kotor dan lihat kategori UMKM Anda
            </div>
            <Link 
              href="/umkm"
              className="absolute inset-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="sr-only">UMKM Category</span>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Track your gross profit margin regularly</li>
              <li>• Consider seasonal pricing adjustments</li>
              <li>• Monitor competitor pricing</li>
              <li>• Review costs daily and periodically</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
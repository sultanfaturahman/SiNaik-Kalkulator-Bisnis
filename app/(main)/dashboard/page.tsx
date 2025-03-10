import Link from "next/link";
import Head from "next/head"; // Import Head component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Percent,
  HandCoinsIcon,
  DiffIcon,
  Store,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Kalkulator Laba Kotor
              </CardTitle>
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
              <CardTitle className="text-sm font-medium">
                Perhitungan Harga Jual Per-Item
              </CardTitle>
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
              <CardTitle className="text-sm font-medium">
                Kalkulator Diskon
              </CardTitle>
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
              <CardTitle className="text-sm font-medium">
                UMKM Category
              </CardTitle>
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
      </div>

      <footer className="w-full py-6 border-t border-gray-200 mt-auto flex items-center justify-center">
        <p className="text-gray-500 text-sm">
          © 2025 Link Productive. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

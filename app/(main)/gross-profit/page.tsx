"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function GrossProfitPage() {
  const [dateType, setDateType] = useState("daily");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [revenue, setRevenue] = useState("");
  const [costOfGoodsSold, setCostOfGoodsSold] = useState("");
  const [grossProfit, setGrossProfit] = useState<number | null>(null);
  const [profitMargin, setProfitMargin] = useState<number | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<{
    totalProfit: number;
    avgMargin: number;
  } | null>(null);

  const handleCalculate = async () => {
    if (dateType === "daily") {
      const revenueNum = parseFloat(revenue);
      const costNum = parseFloat(costOfGoodsSold);
      const profit = revenueNum - costNum;
      const margin = (profit / revenueNum) * 100;

      setGrossProfit(profit);
      setProfitMargin(margin);

      try {
        const response = await fetch("/api/calculations", {
          method: "POST",
          body: JSON.stringify({
            type: "gross-profit-daily",
            inputs: { date, revenue: revenueNum, costOfGoodsSold: costNum },
            results: { grossProfit: profit, profitMargin: margin }
          }),
          headers: { 
            "Content-Type": "application/json"
          },
          credentials: 'include' // Add this to include cookies
        });

        if (!response.ok) {
          throw new Error('Failed to save calculation');
        }
      } catch (error) {
        console.error("Error saving daily calculation:", error);
      }
    } else {
      // Ambil data laba kotor bulanan
      try {
        const response = await fetch(
          `/api/calculations?month=${month}&type=gross-profit-daily`
        );
        const data = await response.json();

        if (data.length > 0) {
          const totalProfit = data.reduce(
            (acc: number, entry: any) => acc + entry.results.grossProfit,
            0
          );
          const avgMargin =
            data.reduce(
              (acc: number, entry: any) => acc + entry.results.profitMargin,
              0
            ) / data.length;
          setMonthlySummary({ totalProfit, avgMargin });
        } else {
          setMonthlySummary(null);
        }
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kalkulator Laba Kotor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Pilih Jenis Perhitungan
            </label>
            <Select onValueChange={setDateType} value={dateType}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateType === "daily" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Bulan</label>
              <Input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
              />
            </div>
          )}

          {dateType === "daily" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pendapatan</label>
                <Input
                  type="number"
                  placeholder="Masukan Pendapatan"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Harga Pokok Penjualan
                </label>
                <Input
                  type="number"
                  placeholder="Masukan HPP"
                  value={costOfGoodsSold}
                  onChange={(e) => setCostOfGoodsSold(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            Hitung
          </Button>
        </form>

        {grossProfit !== null && dateType === "daily" && (
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

        {monthlySummary && dateType === "monthly" && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Total Laba Kotor Bulanan:</span>
              <span>Rp{monthlySummary.totalProfit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rata-rata Margin Laba:</span>
              <span>{monthlySummary.avgMargin.toFixed(2)}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

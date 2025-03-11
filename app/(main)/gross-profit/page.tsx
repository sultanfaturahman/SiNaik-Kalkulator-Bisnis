"use client";

import { useState, useEffect } from "react";
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
import { formatRupiah, parseRupiah } from "@/lib/utils";

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
  const [dailyAccumulated, setDailyAccumulated] = useState<number | null>(null);

  useEffect(() => {
    if (dateType === "daily" && date) {
      fetch(`/api/calculations?date=${date}&type=gross-profit-daily`)
        .then((res) => res.json())
        .then((data) => {
          const totalAccumulated = data.reduce(
            (acc: number, entry: any) => acc + entry.results.grossProfit,
            0
          );
          setDailyAccumulated(totalAccumulated);
        })
        .catch((error) =>
          console.error("Error fetching daily accumulation:", error)
        );
    }
  }, [date, dateType]);

  const handleCalculate = async () => {
    if (dateType === "daily") {
      const revenueNum = parseFloat(revenue);
      const costNum = parseFloat(costOfGoodsSold);
      const profit = revenueNum - costNum;
      const margin = (profit / revenueNum) * 100;

      setGrossProfit(profit);
      setProfitMargin(margin);

      const calculationData = {
        type: "kalkulator-laba-kotor-harian",
        inputs: { 
          date: date,
          revenue: revenueNum, 
          costOfGoodsSold: costNum 
        },
        results: { 
          grossProfit: profit, 
          profitMargin: margin 
        }
      };

      console.log('Saving calculation:', calculationData);

      try {
        const response = await fetch("/api/calculations", {
          method: "POST",
          body: JSON.stringify(calculationData),
          headers: { 
            "Content-Type": "application/json"
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Save response error:', errorData);
          throw new Error('Failed to save calculation');
        }

        const savedData = await response.json();
        console.log('Save successful:', savedData);
      } catch (error) {
        console.error("Error saving daily calculation:", error);
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kalkulator Laba Kotor</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculate();
          }}
          className="space-y-4"
        >
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
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
                  <Input
                    type="text"
                    placeholder="Masukan Pendapatan"
                    value={formatRupiah(revenue)}
                    onChange={(e) => setRevenue(parseRupiah(e.target.value))}
                    required
                    className="pl-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Harga Pokok Penjualan</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
                  <Input
                    type="text"
                    placeholder="Masukan HPP"
                    value={formatRupiah(costOfGoodsSold)}
                    onChange={(e) => setCostOfGoodsSold(parseRupiah(e.target.value))}
                    required
                    className="pl-12"
                  />
                </div>
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            Hitung
          </Button>
        </form>

        {dailyAccumulated !== null && dateType === "daily" && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Laba Kotor:</span>
              <span>Rp {formatRupiah(grossProfit || 0)}</span>
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
              <span>Rp {formatRupiah(monthlySummary.totalProfit)}</span>
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

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatRupiah } from "@/lib/utils"

interface Calculation {
  id: number
  type: string
  inputs: {
    date?: string
    revenue?: number
    costOfGoodsSold?: number
  }
  results: {
    grossProfit?: number
    profitMargin?: number
  }
}

const formatCalculationType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'kalkulator-laba-kotor-harian': 'Laba Kotor Harian',
    // Add more type mappings as needed
  };
  
  return typeMap[type] || type;
};

const formatMonth = (monthYear: string) => {
  const [year, month] = monthYear.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
};

const calculateTotals = (calculations: Calculation[]) => {
  return calculations.reduce((acc, calc) => ({
    totalRevenue: acc.totalRevenue + (calc.inputs.revenue || 0),
    totalCost: acc.totalCost + (calc.inputs.costOfGoodsSold || 0),
    totalGrossProfit: acc.totalGrossProfit + (calc.results.grossProfit || 0),
    averageMargin: acc.averageMargin + (calc.results.profitMargin || 0)
  }), {
    totalRevenue: 0,
    totalCost: 0,
    totalGrossProfit: 0,
    averageMargin: 0
  });
};

export default function ReportsPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [allCalculations, setAllCalculations] = useState<Calculation[]>([])

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        console.log('Fetching calculations...');
        const response = await fetch('/api/calculations?type=kalkulator-laba-kotor-harian');
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Fetch response error:', errorData);
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched calculations:', data);

        // Sort by input date in ascending order (oldest to newest)
        const sortedData = data.sort((a: Calculation, b: Calculation) => {
          const dateA = a.inputs.date || '';
          const dateB = b.inputs.date || '';
          return dateA.localeCompare(dateB); // Changed sort order
        });
        
        console.log('Sorted calculations:', sortedData);
        setAllCalculations(sortedData);
        setCalculations(sortedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load calculations');
      } finally {
        setLoading(false);
      }
    };

    fetchCalculations();
  }, [])

  // Get unique months from calculations based on input date
  const getAvailableMonths = () => {
    const months = new Set(
      allCalculations
        .filter(calc => calc.inputs?.date) // Filter out calculations without dates
        .map(calc => {
          const [year, month] = calc.inputs!.date!.split('-');
          return `${year}-${month}`;
        })
    );
    return Array.from(months).sort().reverse();
  };

  // Filter calculations by selected month using input date
  const filterByMonth = (month: string) => {
    setSelectedMonth(month);
    if (month === "all") {
      setCalculations(allCalculations);
      return;
    }

    const filtered = allCalculations.filter(calc => {
      if (!calc.inputs?.date) return false;
      const [year, monthFromDate] = calc.inputs.date.split('-');
      const calcMonth = `${year}-${monthFromDate}`;
      return calcMonth === month;
    });
    setCalculations(filtered);
  };

  const renderTotals = () => {
    if (calculations.length === 0) return null;
    
    const totals = calculateTotals(calculations);
    const avgMargin = totals.averageMargin / calculations.length;

    return (
      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2">Ringkasan:</h3>
        <div className="space-y-2">
          <div>Total Pendapatan: {formatRupiah(totals.totalRevenue)}</div>
          <div>Total HPP: {formatRupiah(totals.totalCost)}</div>
          <div>Total Laba Kotor: {formatRupiah(totals.totalGrossProfit)}</div>
          <div>Rata-rata Margin: {avgMargin.toFixed(2)}%</div>
        </div>
      </div>
    );
  }

  const exportToPDF = () => {
    // Create new document (use A4 format)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const totals = calculateTotals(calculations);
    
    // Load and add logo
    const logoImg = new Image();
    logoImg.src = '/logo.jpeg';
    
    logoImg.onload = () => {
      // Convert the image to base64
      const canvas = document.createElement('canvas');
      canvas.width = logoImg.width;
      canvas.height = logoImg.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(logoImg, 0, 0);
      const base64Image = canvas.toDataURL('image/jpeg');
      
      // Logo settings
      // Try these measurements for a larger logo:
      const logoConfig = {
        width: 25,    // Width in millimeters (increase for bigger logo)
        height: 25,   // Height in millimeters (increase for bigger logo)
        x: 155,       // Position from left edge (decrease to move left)
        y: 10         // Position from top edge (increase to move down)
      };

      // Add logo to PDF
      doc.addImage(
        base64Image,
        'JPEG',
        logoConfig.x,
        logoConfig.y,
        logoConfig.width,
        logoConfig.height
      );

      // Add title (adjusted position to align with logo)
      doc.setFontSize(16);
      doc.text('Laporan Perhitungan', 14, 25);
      
      // Add filter information
      doc.setFontSize(10);
      const filterText = selectedMonth === "all" 
        ? "Periode: Semua Bulan" 
        : `Periode: ${formatMonth(selectedMonth)}`;
      doc.text(filterText, 14, 33);
      
      // Define the table columns and rows
      const tableColumn = ['Tanggal', 'Tipe', 'Pendapatan', 'HPP', 'Laba Kotor', 'Margin'];
      
      // Sort calculations by date in ascending order for PDF
      const sortedCalculations = [...calculations].sort((a, b) => {
        const dateA = a.inputs.date || '';
        const dateB = b.inputs.date || '';
        return dateA.localeCompare(dateB);
      });
      
      const tableRows = sortedCalculations.map(calc => [
        calc.inputs.date || '',
        formatCalculationType(calc.type),
        formatRupiah(calc.inputs.revenue || 0),
        formatRupiah(calc.inputs.costOfGoodsSold || 0),
        formatRupiah(calc.results.grossProfit || 0),
        `${calc.results.profitMargin?.toFixed(2) || '0.00'}%`
      ]);

      // Add totals rows
      tableRows.push(
        ['', '', '', '', '', ''],  // Empty row for spacing
        ['TOTAL:', '', 
         formatRupiah(totals.totalRevenue),
         formatRupiah(totals.totalCost),
         formatRupiah(totals.totalGrossProfit),
         `${(totals.averageMargin / calculations.length).toFixed(2)}%`
        ]
      );

      // Use autoTable with adjusted starting position
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40, // Adjusted to accommodate logo and header
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        margin: { top: 40 }, // Add margin to avoid overlapping with header
      });

      // Generate filename
      const filename = selectedMonth === "all" 
        ? 'laporan-perhitungan-semua.pdf'
        : `laporan-perhitungan-${selectedMonth}.pdf`;
      
      // Save the PDF
      doc.save(filename);
    };

    // Handle any errors loading the image
    logoImg.onerror = () => {
      console.error('Error loading logo image');
      // Proceed with PDF generation without the logo
      generatePDFWithoutLogo();
    };
  };

  // Fallback function if logo fails to load
  const generatePDFWithoutLogo = () => {
    const doc = new jsPDF();
    // ... rest of your PDF generation code without the logo ...
    // (Copy the content from inside the logoImg.onload callback, excluding the logo-related code)
  };

  const exportToCSV = () => {
    // Prepare the CSV data
    const csvRows = [
      ['Tanggal', 'Tipe', 'Pendapatan', 'HPP', 'Laba Kotor', 'Margin'],
      ...calculations.map(calc => [
        calc.inputs.date,
        formatCalculationType(calc.type),
        calc.inputs.revenue || 0,
        calc.inputs.costOfGoodsSold || 0,
        calc.results.grossProfit || 0,
        `${calc.results.profitMargin?.toFixed(2)}%`
      ])
    ]

    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'laporan-perhitungan.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Laporan Perhitungan</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToPDF}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">
            Filter berdasarkan Bulan:
          </label>
          <Select
            value={selectedMonth}
            onValueChange={filterByMonth}
          >
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bulan</SelectItem>
              {getAvailableMonths().map(month => (
                <SelectItem key={month} value={month}>
                  {formatMonth(month)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {calculations.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Tidak ada data untuk periode ini
            </div>
          ) : (
            <>
              {calculations.map((calc) => (
                <div key={calc.id} className="border p-4 rounded-lg">
                  <div>Tanggal Laporan: {calc.inputs.date}</div>
                  <div>Tipe: {formatCalculationType(calc.type)}</div>
                  <div>Pendapatan: {formatRupiah(calc.inputs.revenue || 0)}</div>
                  <div>HPP: {formatRupiah(calc.inputs.costOfGoodsSold || 0)}</div>
                  <div>Laba Kotor: {formatRupiah(calc.results.grossProfit || 0)}</div>
                  <div>Margin: {calc.results.profitMargin?.toFixed(2)}%</div>
                </div>
              ))}
              {renderTotals()}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 

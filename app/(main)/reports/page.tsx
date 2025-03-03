"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Download, FileText } from "lucide-react"
import { jsPDF } from "jspdf"

interface CalculationRecord {
  type: string
  date: string
  inputs: Record<string, any>
  results: Record<string, any>
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("all")
  const [calculationType, setCalculationType] = useState("all")

  // Mock data - replace with actual data from your database
  const calculations: CalculationRecord[] = [
    {
      type: "Gross Profit",
      date: "2024-03-20",
      inputs: { revenue: 1000, costOfGoodsSold: 600 },
      results: { grossProfit: 400, profitMargin: 40 }
    },
    // Add more records
  ]

  const exportToCSV = () => {
    const headers = ["Type", "Date", "Inputs", "Results"]
    const csvData = calculations.map(calc => [
      calc.type,
      calc.date,
      JSON.stringify(calc.inputs),
      JSON.stringify(calc.results)
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "calculations-report.csv"
    a.click()
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Add company header
    doc.setFillColor(52, 152, 219) // Change header background color
    doc.rect(0, 0, 220, 40, "F")
    
    // Get page width
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Add centered title
    doc.setTextColor(255, 255, 255) // Change text color
    doc.setFontSize(24)
    doc.text("SiNaik App", pageWidth/2, 20, { align: "center" })
    
    // Add centered subtitle
    doc.setFontSize(14)
    doc.text("Laporan Keuangan", pageWidth/2, 30, { align: "center" })
    
    // Reset text color to black
    doc.setTextColor(0, 0, 0)
    
    // Add date
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50)
    
    let y = 70 // Start content after header
    
    calculations.forEach((calc, index) => {
      // Check if we need a new page
      if (y > 250) {
        doc.addPage()
        y = 20 // Reset Y position on new page
      }
      
      // Add calculation header with background
      doc.setFillColor(240, 240, 240) // Light gray background
      doc.rect(15, y-5, 180, 10, "F")
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(`${calc.type} - ${calc.date}`, 20, y)
      y += 15 // Adjust vertical spacing
      
      // Add inputs section
      doc.setFont("helvetica", "bold")
      doc.text("Inputs:", 20, y)
      doc.setFont("helvetica", "normal")
      y += 10
      
      // Create a table-like structure for inputs
      Object.entries(calc.inputs).forEach(([key, value]) => {
        doc.text(`${key}:`, 30, y)
        doc.text(`${value}`, 100, y)
        y += 7
      })
      
      y += 5 // Add some space
      
      // Add results section
      doc.setFont("helvetica", "bold")
      doc.text("Results:", 20, y)
      doc.setFont("helvetica", "normal")
      y += 10
      
      // Create a table-like structure for results
      Object.entries(calc.results).forEach(([key, value]) => {
        doc.text(`${key}:`, 30, y)
        doc.text(`${value}`, 100, y)
        y += 7
      })
      
      // Add separator line
      y += 5
      doc.setDrawColor(200, 200, 200) // Light gray line
      doc.line(20, y, 190, y)
      y += 15 // Space after separator
    })
    
    // Add footer
    const pageCount = doc.getNumberOfPages()
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Page ${i} of ${pageCount}`, 20, 290)
    }

    doc.save("business-calculations-report.pdf")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Calculation Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="space-x-4">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border rounded p-2"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value)}
                className="border rounded p-2"
              >
                <option value="all">All Calculations</option>
                <option value="gross-profit">Gross Profit</option>
                <option value="price-per-unit">Price per Unit</option>
                <option value="discount">Discount</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="default" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="default" onClick={exportToPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Inputs</TableHead>
                <TableHead>Results</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculations.map((calc, index) => (
                <TableRow key={index}>
                  <TableCell>{calc.date}</TableCell>
                  <TableCell>{calc.type}</TableCell>
                  <TableCell>
                    {Object.entries(calc.inputs).map(([key, value]) => (
                      <div key={key}>{`${key}: ${value}`}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {Object.entries(calc.results).map(([key, value]) => (
                      <div key={key}>{`${key}: ${value}`}</div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 
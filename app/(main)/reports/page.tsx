"use client"

import { useState, useEffect } from "react"
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
import { getAllCalculations, getCalculationsByDateRange, getCalculationsByType } from "@/lib/db"

interface CalculationRecord {
  id: number
  type: string
  date: string
  inputs: Record<string, any>
  results: Record<string, any>
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("all")
  const [calculationType, setCalculationType] = useState("all")
  const [calculations, setCalculations] = useState<CalculationRecord[]>([])

  useEffect(() => {
    loadCalculations()
  }, [dateRange, calculationType])

  const loadCalculations = async () => {
    try {
      let data
      if (dateRange === "all" && calculationType === "all") {
        data = await getAllCalculations()
      } else if (dateRange !== "all") {
        const now = new Date()
        let startDate = new Date()
        
        switch (dateRange) {
          case "today":
            startDate.setHours(0, 0, 0, 0)
            break
          case "week":
            startDate.setDate(now.getDate() - 7)
            break
          case "month":
            startDate.setMonth(now.getMonth() - 1)
            break
        }
        
        data = await getCalculationsByDateRange(startDate, now)
      } else if (calculationType !== "all") {
        data = await getCalculationsByType(calculationType)
      }

      if (!data) return

      setCalculations(data.map(calc => ({
        id: Number(calc.id),
        type: calc.type,
        date: new Date(calc.date).toLocaleDateString(),
        inputs: calc.inputs as Record<string, any>,
        results: calc.results as Record<string, any>
      })))
    } catch (error) {
      console.error("Error loading calculations:", error)
    }
  }

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
    doc.setFillColor(52, 152, 219)
    doc.rect(0, 0, 220, 40, "F")
    
    // Get page width
    const pageWidth = doc.internal.pageSize.getWidth()

    try {
      // Add logo
      const img = new Image()
      img.src = '/linkproductivelogo.jpg'
      doc.addImage(img, 'JPEG', 10, 5, 50, 30)
    } catch (error) {
      console.error('Error adding logo:', error)
    }
    
    // Add title and subtitle
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text("SiNaik App", pageWidth/2 + 25, 20, { align: "center" })
    
    doc.setFontSize(14)
    doc.text("Laporan Keuangan", pageWidth/2 + 25, 30, { align: "center" })
    
    // Add date
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, 50, { align: "right" })
    
    let y = 70

    calculations.forEach((calc, index) => {
      if (y > 250) {
        doc.addPage()
        y = 20 // Reset Y position on new page
      }
      
      doc.setFillColor(240, 240, 240)
      doc.rect(15, y-5, 180, 10, "F")
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(`${calc.type} - ${calc.date}`, 20, y)
      y += 15
      
      doc.setFont("helvetica", "bold")
      doc.text("Inputs:", 20, y)
      doc.setFont("helvetica", "normal")
      y += 10
      
      Object.entries(calc.inputs).forEach(([key, value]) => {
        doc.text(`${key}:`, 30, y)
        doc.text(`${value}`, 100, y)
        y += 7
      })
      
      y += 5
      
      doc.setFont("helvetica", "bold")
      doc.text("Results:", 20, y)
      doc.setFont("helvetica", "normal")
      y += 10
      
      Object.entries(calc.results).forEach(([key, value]) => {
        doc.text(`${key}:`, 30, y)
        doc.text(`${value}`, 100, y)
        y += 7
      })
      
      y += 5
      doc.setDrawColor(200, 200, 200)
      doc.line(20, y, 190, y)
      y += 15
    })
    
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
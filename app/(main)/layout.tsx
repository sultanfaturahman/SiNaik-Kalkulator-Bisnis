import Link from 'next/link'
import { Home, LogOut, FileText, Store } from 'lucide-react'
import { headers } from 'next/headers'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
          Home
          </Link>
          <ul className="flex space-x-6 justify-center flex-grow">
            <li>
              <Link href="/gross-profit" className="text-sm font-medium transition-colors hover:text-primary">
                Gross Profit
              </Link>
            </li>
            <li>
              <Link href="/price-per-unit" className="text-sm font-medium transition-colors hover:text-primary">
                Price per Unit
              </Link>
            </li>
            <li>
              <Link href="/discount" className="text-sm font-medium transition-colors hover:text-primary">
                Discount
              </Link>
            </li>
            <li>
              <Link href="/reports" className=" text-sm font-medium transition-colors hover:text-primary">
                Reports
              </Link>
            </li>
            <li>
              <Link href="/umkm" className="inline-flex items-center text-sm font-medium transition-colors hover:text-primary">
                UMKM Status
              </Link>
            </li>
          </ul>
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm font-medium transition-colors hover:text-primary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Link>
        </div>
      </nav>
      <main className="container py-6">{children}</main>
    </div>
  )
}
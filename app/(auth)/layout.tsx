import { Inter } from 'next/font/google'
import '@/app/globals.css'

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="h-screen">{children}</main>
    </div>
  )
} 
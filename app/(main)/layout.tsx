"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh(); // Force a refresh of the router cache
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link
            href="/dashboard"
            className="transition-colors hover:opacity-80"
          >
            <Image src="/logo.jpeg" alt="Home" width={40} height={40} />
          </Link>
          <ul className="flex space-x-6 justify-center flex-grow">
            <li>
              <Link
                href="/gross-profit"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Laba Kotor
              </Link>
            </li>
            <li>
              <Link
                href="/price-per-unit"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Harga Per Unit
              </Link>
            </li>
            <li>
              <Link
                href="/discount"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Diskon
              </Link>
            </li>
            <li>
              <Link
                href="/reports"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Laporan
              </Link>
            </li>
            <li>
              <Link
                href="/umkm"
                className="inline-flex items-center text-sm font-medium transition-colors hover:text-primary"
              >
                Status UMKM
              </Link>
            </li>
          </ul>
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="inline-flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container py-6">{children}</main>
    </div>
  );
}

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
            className="relative group transition-transform duration-300 hover:scale-110"
          >
            <Image 
              src="/logo.jpeg" 
              alt="Home" 
              width={40} 
              height={40}
              className="rounded-md transition-all duration-300 group-hover:shadow-lg" 
            />
          </Link>
          <ul className="flex space-x-6 justify-center flex-grow">
            <li>
              <Link
                href="/gross-profit"
                className="relative text-sm font-medium transition-colors hover:text-primary group"
              >
                Laba Kotor
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/price-per-unit"
                className="relative text-sm font-medium transition-colors hover:text-primary group"
              >
                Harga Per Unit
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/discount"
                className="relative text-sm font-medium transition-colors hover:text-primary group"
              >
                Diskon
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/reports"
                className="relative text-sm font-medium transition-colors hover:text-primary group"
              >
                Laporan
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/umkm"
                className="relative text-sm font-medium transition-colors hover:text-primary group"
              >
                Status UMKM
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </li>
          </ul>
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="relative group flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <User className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative">
                Profile
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="relative group text-sm font-medium transition-colors hover:text-primary"
            >
              <span className="relative">
                Logout
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </button>
          </div>
        </div>
      </nav>
      <main className="container py-6">{children}</main>
    </div>
  );
}

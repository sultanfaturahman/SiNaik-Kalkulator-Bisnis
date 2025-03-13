"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";

interface UmkmCounts {
  'ultra-mikro': number;
  'super-mikro': number;
  'mikro': number;
  'kecil': number;
  'status-umkm-naik-kelas': number;
}

// Utility function to format level text
const formatLevelText = (text: string): string => {
  return text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
};

// Level button component
function LevelButton({ level, count }: { level: string; count: number }) {
  return (
    <Link
      href={`/instansiDashboard/${level}`}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black">
          {formatLevelText(level)}
        </h3>
        <span className="bg-black text-white px-3 py-1 rounded-full text-sm">
          {count} UMKM
        </span>
      </div>
    </Link>
  );
}

// Dashboard header component
function DashboardHeader() {
  return (
    <div className="bg-white px-6 py-4 rounded-xl shadow-md w-full max-w-4xl text-center">
      <h2 className="text-2xl font-semibold">
        Dashboard Instansi
      </h2>
      <p className="text-gray-600 mt-2">
        Monitoring UMKM Berdasarkan Kategori
      </p>
    </div>
  );
}

export default function InstansiDashboardPage() {
  const [umkmCounts, setUmkmCounts] = useState<UmkmCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUmkmData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/umkm');
        if (!response.ok) {
          throw new Error('Failed to fetch UMKM data');
        }
        const data = await response.json();
        
        // Calculate counts for each category
        const counts: UmkmCounts = {
          'ultra-mikro': data['ultra-mikro']?.length || 0,
          'super-mikro': data['super-mikro']?.length || 0,
          'mikro': data['mikro']?.length || 0,
          'kecil': data['kecil']?.length || 0,
          'status-umkm-naik-kelas': data['status-umkm-naik-kelas']?.length || 0
        };
        
        setUmkmCounts(counts);
      } catch (err) {
        setError('Failed to load UMKM data. Please try again later.');
        console.error('Error fetching UMKM data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUmkmData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-grow p-6 flex flex-col items-center">
        <DashboardHeader />
        
        <div className="w-full max-w-4xl mt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data UMKM...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : umkmCounts ? (
            <div className="grid gap-4">
              {Object.entries(umkmCounts).map(([level, count]) => (
                <LevelButton key={level} level={level} count={count} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow-md max-w-4xl w-full">
          <h3 className="text-lg font-semibold mb-2">Informasi Kategori UMKM:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Ultra Mikro: Laba kotor tahunan kurang dari Rp 30 juta</li>
            <li>• Super Mikro: Laba kotor tahunan Rp 30 juta - Rp 60 juta</li>
            <li>• Mikro: Laba kotor tahunan Rp 60 juta - Rp 167 juta</li>
            <li>• Kecil: Laba kotor tahunan Rp 167 juta - Rp 4,8 miliar</li>
            <li>• UMKM Naik Kelas: Laba kotor tahunan lebih dari Rp 4,8 miliar</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

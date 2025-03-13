"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";

// Types
interface UmkmItem {
  id: string;
  name: string;
  businessAddress: string | null;
  annualGrossProfit: number;
}

interface PageProps {
  params: Promise<{ level: string }>;
}

// Utility function to format level text
const formatLevelText = (text: string): string => {
  return text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
};

// UMKM button component
function UmkmButton({ umkm }: { umkm: UmkmItem }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <Link
        href={`/umkm/${umkm.id}`}
        className="flex flex-col gap-2"
      >
        <h3 className="text-lg font-semibold text-black">{umkm.name}</h3>
        {umkm.businessAddress && (
          <p className="text-sm text-gray-600">{umkm.businessAddress}</p>
        )}
        <p className="text-sm text-gray-800">
          Laba Kotor Tahunan: Rp {new Intl.NumberFormat('id-ID').format(umkm.annualGrossProfit)}
        </p>
      </Link>
    </div>
  );
}

// Level header component
function LevelHeader({ level }: { level: string }) {
  return (
    <div className="bg-white px-6 py-4 rounded-xl shadow-md w-full max-w-4xl text-center">
      <h2 className="text-2xl font-semibold">
        {formatLevelText(level)}
      </h2>
    </div>
  );
}

export default function UmkmLevelPage({ params }: PageProps) {
  const { level } = use(params);
  const [umkmList, setUmkmList] = useState<UmkmItem[]>([]);
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
        
        // Get the UMKM list for the current level
        if (level in data) {
          setUmkmList(data[level]);
        } else {
          setUmkmList([]);
        }
      } catch (err) {
        setError('Failed to load UMKM data. Please try again later.');
        console.error('Error fetching UMKM data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUmkmData();
  }, [level]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-grow p-6 flex flex-col items-center">
        <LevelHeader level={level} />

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
          ) : umkmList.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              Tidak ada UMKM dalam kategori ini
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {umkmList.map((umkm) => (
                <UmkmButton key={umkm.id} umkm={umkm} />
              ))}
            </div>
          )}
        </div>

        <Link
          href="/instansiDashboard"
          className="mt-6 text-gray-600 hover:text-gray-900 hover:underline transition-all duration-300"
        >
          Kembali ke Dashboard
        </Link>
      </main>

      <Footer />
    </div>
  );
}

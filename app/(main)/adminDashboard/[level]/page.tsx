"use client";

import { useRouter } from "next/navigation";
import { umkmData } from "@/app/api/data"; // Sesuaikan path dengan lokasi data.ts

interface PageProps {
  params: { level: string };
}

export default function UmkmLevelPage({ params }: PageProps) {
  const router = useRouter();
  const { level } = params as { level: keyof typeof umkmData };

  // Ambil data UMKM berdasarkan level
  const umkmList = umkmData[level] || [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Title */}
      <div className="flex-grow flex flex-col items-center">
        <div className="bg-gray-200 px-6 py-3 rounded-xl mt-10 shadow-md">
          <h2 className="text-xl font-semibold capitalize">
            {level.replace("_", " ")}
          </h2>
        </div>

        {/* List UMKM */}
        <div className="flex flex-col gap-3 mt-6">
          {umkmList.map((umkm) => (
            <button
              key={umkm.id}
              className="bg-black text-white px-6 py-3 rounded-full text-center w-52 transition hover:bg-gray-800"
              onClick={() => router.push(`/umkm/${umkm.id}`)}
            >
              {umkm.name}
            </button>
          ))}
        </div>

        {/* Tombol Kembali */}
        <button
          className="bg-gray-500 text-white px-6 py-3 rounded-full mt-6 transition hover:bg-gray-600"
          onClick={() => router.back()}
        >
          Kembali
        </button>
      </div>

      {/* Footer Sticky */}
      <footer className="w-full py-4 flex flex-col items-center border-t border-gray-300 sticky bottom-0 bg-white">
        <p className="text-gray-500 text-sm">© 2025 Link Productive</p>
      </footer>
    </div>
  );
}

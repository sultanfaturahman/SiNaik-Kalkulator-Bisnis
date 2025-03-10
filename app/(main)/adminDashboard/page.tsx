"use client"; // 👈 Add this

import { useRouter } from "next/navigation";

export default function UmkmPage() {
  const router = useRouter();

  const level = [
    "Ultra Mikro",
    "Super Mikro",
    "Mikro",
    "Kecil",
    "Status UMKM Naik Kelas"
  ];

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white">
      {/* Title */}
      <div className="bg-gray-200 px-6 py-3 rounded-xl mt-10 shadow-md">
        <h2 className="text-xl font-semibold">Level UMKM</h2>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        {level.map((level, index) => (
          <button
            key={index}
            className="bg-black text-white px-6 py-3 rounded-full text-center w-52 transition hover:bg-gray-800"
            onClick={() =>
              router.push(`/adminDashboard/${level.toLowerCase().replace(/\s/g, "-")}`)
            }
          >
            {level}
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="w-full py-4 flex flex-col items-center border-t border-gray-300 mt-6">
        <p className="text-gray-500 text-sm">© 2025 Link Productive</p>
      </footer>
    </div>
  );
}

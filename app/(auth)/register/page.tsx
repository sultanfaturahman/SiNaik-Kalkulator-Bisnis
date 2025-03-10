"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("umkm");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessAddress: "",
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Form Data:", formData);
    // Simpan ke database atau API di sini...

    // Redirect setelah submit (bisa diganti)
    router.push("/login");
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Business Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Dropdown Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Pendaftaran</label>
            </div>

            {/* Common Fields */}
            <div className="space-y-2">
              <Input
                name="name"
                type="text"
                placeholder="Nama"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <select
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="umkm">UMKM</option>
                <option value="instansi">Instansi</option>
              </select>
            </div>

            {/* Dynamic Fields Based on Selection */}
            {selectedType === "umkm" ? (
              <>
                <Input
                  name="businessName"
                  type="text"
                  placeholder="Nama Perusahaan"
                  required
                  value={formData.businessName}
                  onChange={handleInputChange}
                />
                <Input
                  name="businessAddress"
                  type="text"
                  placeholder="Alamat Perusahaan"
                  required
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <>
                <Input
                  name="businessName"
                  type="text"
                  placeholder="Nama Instansi"
                  required
                  value={formData.businessName}
                  onChange={handleInputChange}
                />
                <Input
                  name="businessAddress"
                  type="text"
                  placeholder="Alamat Instansi"
                  required
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                />
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Daftar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-6">
        <p className="text-center text-gray-500 text-sm">
          #1 Integrated Tech To Increase Your Productivity
        </p>
      </footer>
    </div>
  );
}

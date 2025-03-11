'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("umkm");
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessAddress: "",
    selectedType: "umkm"
  });

  const handleGoogleRegister = async () => {
    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Google registration error:", error);
      setError("Failed to register with Google");
    }
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  }

  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newType = event.target.value;
    setSelectedType(newType);
    setFormData(prev => ({
      ...prev,
      selectedType: newType
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setValidationErrors({});

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          const errors: Record<string, string> = {};
          data.details.forEach((error: any) => {
            errors[error.path[0]] = error.message;
          });
          setValidationErrors(errors);
          throw new Error('Validation failed');
        }
        throw new Error(data.error || 'Registration failed');
      }

      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Business Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Register with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or register with email
                </span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="space-y-2">
                <label htmlFor="userType" className="text-sm font-medium">Type</label>
                <select
                  id="userType"
                  name="userType"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedType}
                  onChange={handleTypeChange}
                >
                  <option value="umkm">UMKM</option>
                  <option value="instansi">Instansi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nama"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={validationErrors.name ? 'border-red-500' : ''}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                )}

                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={validationErrors.email ? 'border-red-500' : ''}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}

                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={validationErrors.password ? 'border-red-500' : ''}
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="businessName" className="text-sm font-medium">
                  {selectedType === "umkm" ? "Nama Perusahaan" : "Nama Instansi"}
                </label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder={selectedType === "umkm" ? "Nama Perusahaan" : "Nama Instansi"}
                  required
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={validationErrors.businessName ? 'border-red-500' : ''}
                />
                {validationErrors.businessName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.businessName}</p>
                )}

                <label htmlFor="businessAddress" className="text-sm font-medium">
                  {selectedType === "umkm" ? "Alamat Perusahaan" : "Alamat Instansi"}
                </label>
                <Input
                  id="businessAddress"
                  name="businessAddress"
                  type="text"
                  placeholder={selectedType === "umkm" ? "Alamat Perusahaan" : "Alamat Instansi"}
                  required
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  className={validationErrors.businessAddress ? 'border-red-500' : ''}
                />
                {validationErrors.businessAddress && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.businessAddress}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Daftar
              </Button>
            </form>
          </div>
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

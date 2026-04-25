import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import api from "../services/api";

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.post("/users", { name, email, password });
      navigate("/login", { state: { message: "Registrasi berhasil! Silakan login." } });
    } catch (err: any) {
      setError(err.response?.data?.error || "Terjadi kesalahan saat registrasi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Daftar Akun</h3>
        <p className="text-gray-500 mt-1">Buat akun baru untuk melanjutkan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <Input
          label="Nama Lengkap"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
        
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          required
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Daftar
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
};

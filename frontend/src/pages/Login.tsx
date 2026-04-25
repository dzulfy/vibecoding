import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import api from "../services/api";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/users/login", { email, password });
      if (response.data?.data) {
        localStorage.setItem("token", response.data.data);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Masuk</h3>
        <p className="text-gray-500 mt-1">Silakan masuk ke akun Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        
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
          Masuk
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Belum punya akun?{" "}
        <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
};

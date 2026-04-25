import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import api from "../services/api";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.delete("/users/logout");
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 text-xl tracking-tight">
        <div className="bg-indigo-600 text-white p-1.5 rounded-xl shadow-sm">
          <UserIcon size={20} strokeWidth={2.5} />
        </div>
        AppAuth
      </Link>
      
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Keluar</span>
      </button>
    </nav>
  );
};

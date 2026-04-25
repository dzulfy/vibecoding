import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { User as UserIcon } from "lucide-react";

export const AuthLayout: React.FC = () => {
  const token = localStorage.getItem("token");

  // Jika sudah login, redirect ke halaman utama (profile)
  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-3.5 rounded-2xl shadow-xl shadow-indigo-600/20">
            <UserIcon size={32} strokeWidth={2.5} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 tracking-tight">
          Sistem Autentikasi
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/70 backdrop-blur-xl py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const MainLayout: React.FC = () => {
  const token = localStorage.getItem("token");

  // Jika belum login, redirect ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-indigo-600 pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10 mt-8">
        <Outlet />
      </main>
    </div>
  );
};

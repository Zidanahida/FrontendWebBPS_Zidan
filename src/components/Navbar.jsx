// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 
import { useNavigate } from "react-router-dom"; 

const navItems = [
  { id: "publications", label: "Daftar Publikasi", path: "/publications" },
  { id: "add", label: "Tambah Publikasi", path: "/publications/add" },
  { id: "logout", label: "Logout", path: "/logout" },
];

function BpsLogo() {
  return (
    <img
      src="https://res.cloudinary.com/djcm0swgo/image/upload/v1751775675/bps-logo_1_ldppzk.png"
      alt="BPS Logo"
      className="h-12 w-12"
    />
  );
}

export default function Navbar() {
  const location = useLocation();
  // --- UBAH INI: Dari { logout } menjadi { logoutAction } ---
  const { logoutAction } = useAuth(); // <-- PENTING: Dapatkan fungsi logoutAction
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await logoutAction(); // <-- PANGGIL logoutAction
      navigate("/login"); 
      alert("Anda telah berhasil logout.");
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Gagal logout. Silakan coba lagi.");
    }
  };

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-[#0369A1] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BpsLogo />
            <span
              className="text-white text-base md:text-lg font-bold tracking-wide hidden sm:block"
            >
              BPS PROVINSI GORONTALO
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.id === "add" &&
                  location.pathname.startsWith("/publications/add")) ||
                (item.id === "publications" &&
                  location.pathname === "/publications");

              if (item.id === "logout") {
                return (
                  <button
                    key={item.id}
                    onClick={handleLogout} 
                    className="px-3 py-2 rounded-md text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 border border-transparent cursor-pointer ${
                    isActive
                      ? "bg-white text-sky-900 shadow-md font-bold"
                      : "text-sky-100 hover:bg-sky-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
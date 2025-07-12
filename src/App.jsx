// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // Import useLocation
import Navbar from "./components/Navbar";
import PublicationListPage from "./components/PublicationListPage";
import AddPublicationPage from "./components/AddPublicationPage";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import EditPublicationPage from "./components/EditPublicationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth"; // Import useAuth untuk memeriksa status login

export default function App() {
  const location = useLocation(); // Hook untuk mendapatkan lokasi saat ini
  const { isAuthenticated } = useAuth(); // Dapatkan status autentikasi dari useAuth

  // Tentukan apakah navbar harus ditampilkan
  // Navbar akan ditampilkan jika sudah login, ATAU
  // jika rute saat ini BUKAN /login dan BUKAN /register.
  // Namun, cara yang lebih tepat adalah hanya tampilkan jika isAuthenticated
  // atau jika rute adalah protected route (yang sudah dihandle oleh ProtectedRoute).
  // Untuk tujuan ini, kita akan menyembunyikannya di login/register.
  const shouldShowNavbar = isAuthenticated || (
    !location.pathname.startsWith('/login') &&
    !location.pathname.startsWith('/register')
  );
  // Koreksi: Seharusnya jika isAuthenticated, atau berada di route yang memang seharusnya ada navbar.
  // Cara paling bersih: hanya tampilkan navbar jika user isAuthenticated
  // Atau, jika Anda ingin navbar tetap ada di halaman publik (misalnya, beranda tanpa login)
  // maka logikanya perlu disesuaikan.
  // Untuk kasus ini, karena "Daftar Publikasi", "Tambah Publikasi", "Logout" hanya relevan setelah login,
  // maka navbar hanya perlu muncul JIKA PENGGUNA SUDAH LOGIN.

  const showNavbarAndFooter = isAuthenticated && (
    !location.pathname.startsWith('/login') && 
    !location.pathname.startsWith('/register')
  );
  // ATAU opsi yang lebih sederhana dan fokus pada masalah:
  const showAuthPages = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');


  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Render Navbar hanya jika pengguna terautentikasi DAN tidak di halaman login/register */}
      {!showAuthPages && <Navbar />}

      {/* Atau, lebih baik lagi, gunakan ini jika Navbar Anda memiliki fitur 'Logout' dll. */}
      {/* {isAuthenticated && <Navbar />} */}
      {/* Namun, jika Anda ingin Navbar tetap muncul di publications page tanpa login, ini perlu logika berbeda */}
      {/* Melihat screenshot Anda, Navbar berisi "Daftar Publikasi", "Tambah Publikasi", "Logout"
          yang jelas merupakan fitur setelah login. Jadi, paling logis adalah: */}

      <main className={`${showAuthPages ? '' : 'p-4 sm:p-6 lg:p-8'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes (Dibungkus AuthProvider di main.jsx, lalu ProtectedRoute memastikan login) */}
          <Route
            path="/publications"
            element={
              <ProtectedRoute>
                <PublicationListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publications/add"
            element={
              <ProtectedRoute>
                <AddPublicationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publications/edit/:id"
            element={
              <ProtectedRoute>
                <EditPublicationPage />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect: Arahkan root ke login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Wildcard Route: Tangani rute yang tidak dikenal, arahkan ke login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      {/* Render Footer hanya jika pengguna terautentikasi DAN tidak di halaman login/register (opsional) */}
      {!showAuthPages && <Footer />}
    </div>
  );
}
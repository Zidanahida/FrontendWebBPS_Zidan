// src/App.jsx
import React, { useState, useEffect } from "react"; // Tambahkan useState dan useEffect
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import PublicationListPage from "./components/PublicationListPage";
import AddPublicationPage from "./components/AddPublicationPage";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import EditPublicationPage from "./components/EditPublicationPage";
import { PublicationProvider } from "./context/PublicationContext";
import ProtectedRoute from "./components/ProtectedRoute";

<Routes>
  {/* Public Route */}
  <Route path="/login" element={<LoginPage />} />
  {/* Protected Routes */}
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
  {/* Redirect Routes */}
  <Route path="/" element={<Navigate to="/publications" replace />} />
  <Route path="*" element={<Navigate to="/publications" replace />} />
</Routes>;

export default function App() {
  // Pindahkan state publications, loading, dan error ke sini (App.jsx)
  const [publications, setPublications] = useState(null); // State untuk data publikasi
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error

  // Effect untuk fetching data publikasi
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true); // Set loading menjadi true saat memulai fetch
        setError(null); // Hapus error sebelumnya

        // Ganti dengan URL API publikasi Anda yang sebenarnya
        // Contoh: const response = await fetch('http://localhost:8000/api/publications');
        // Untuk tujuan praktikum dengan data dummy dari context, kita akan langsung menggunakan data dari context.
        // Karena PublicationProvider sudah ada, kita akan membiarkan PublicationListPage mengambil dari Context.
        // Namun, jika Anda akan fetch dari API, ini adalah tempatnya.

        // Jika Anda BERNIAT fetch dari API, UNCOMMENT dan sesuaikan kode di bawah:
        // const response = await fetch('http://localhost:8000/api/publikasi'); // Sesuaikan URL API Anda
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();
        // setPublications(data);

        // Untuk saat ini, karena PublicationListPage akan mengambil dari context,
        // state publications di App.jsx ini sebenarnya tidak digunakan langsung untuk PublicationListPage
        // unless Anda mengubah PublicationsListPage untuk menerima props publications lagi
        // dan tidak menggunakan context di dalamnya secara langsung.
        // JIKA ANDA INGIN MENGGUNAKAN CONTEXT DI PUBLICATIONLISTPAGE,
        // MAKA TIDAK PERLU STATE publications, loading, error DI APP.JSX INI UNTUK DATA PUBLIKASI.
        // CUKUP WRAP ROUTENYA DENGAN PublicationProvider.

        // Karena Anda tidak disuruh bikin halaman khusus dan sudah punya PublicationContext,
        // maka PublicationListPage yang di-render di Route path="/publications"
        // HARUS MENGGUNAKAN useContext(PublicationContext) untuk mendapatkan data.
        // State publications di App.jsx ini relevan JIKA App.jsx akan fetch dan meneruskan prop secara langsung.
      } catch (err) {
        console.error("Gagal mengambil publikasi di App.jsx:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []); // Hanya jalankan sekali saat komponen mount

  // Untuk menghindari kekeliruan, jika PublicationListPage akan mengambil dari context,
  // maka di sini kita cukup pastikan PublicationProvider membungkus rute yang relevan.
  // Variabel `publications`, `loading`, `error` di App.jsx ini hanya akan relevan
  // jika App.jsx sendiri yang akan meneruskan data sebagai props.

  return (
    // AuthProvider dan PublicationProvider harus membungkus komponen yang memerlukannya
    <div className="bg-gray-100 min-h-screen font-sans">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Pembungkus AuthProvider */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Pembungkus PublicationProvider hanya untuk rute yang memerlukannya */}
          <Route
            path="/publications"
            element={
              <PublicationProvider>
                {" "}
                {/* PublicationProvider membungkus PublicationListPage */}
                {/* PublicationListPage akan menggunakan useContext(PublicationContext) */}
                <PublicationListPage
                // Prop onEdit dan onDelete akan diteruskan dari sini jika PublicationListPage
                // membutuhkannya dan ada di App.jsx,
                // tapi jika logic edit/delete ada di context, PublicationListPage akan ambil dari context.
                // onEdit={someEditFunction}
                // onDelete={someDeleteFunction}
                />
              </PublicationProvider>
            }
          />
          <Route path="/publications/add" element={<AddPublicationPage />} />
          <Route
            path="/publications/edit/:id"
            element={<EditPublicationPage />}
          />
          <Route path="/" element={<Navigate to="/publications" replace />} />
          <Route path="*" element={<Navigate to="/publications" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

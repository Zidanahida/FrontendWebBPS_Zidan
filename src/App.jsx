// src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation, useParams, useNavigate } from "react-router-dom"; // <-- PASTIKAN SEMUA INI ADA

import Navbar from "./components/Navbar";
import PublicationListPage from "./components/PublicationListPage";
import AddPublicationPage from "./components/AddPublicationPage";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import EditPublicationPage from "./components/EditPublicationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { PublicationContext } from "./context/PublicationContext"; // <-- PASTIKAN INI ADA

export default function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { publications, editPublication } = useContext(PublicationContext);

  const showAuthPages = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {!showAuthPages && <Navbar />}

      <main className={`${showAuthPages ? '' : 'p-4 sm:p-6 lg:p-8'}`}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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
          {/* Rute untuk Edit Publikasi */}
          <Route
            path="/publications/edit/:id"
            element={
              <ProtectedRoute>
                {/* Komponen pembantu untuk mengambil ID dan meneruskan props ke EditPublicationPage */}
                <EditPublicationWrapper 
                  publications={publications} 
                  editPublication={editPublication} 
                />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      {!showAuthPages && <Footer />}
    </div>
  );
}

// <-- PENTING: PASTIKAN KOMPONEN INI ADA DI App.jsx ATAU FILE TERPISAH DAN DIIMPORT -->
function EditPublicationWrapper({ publications, editPublication }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Cari publikasi yang sesuai dari daftar publikasi yang tersedia
  const publicationToEdit = publications ? publications.find(pub => pub.id === parseInt(id)) : null;

  const handleCancelEdit = () => {
    navigate('/publications');
  };

  const handleUpdatePublication = async (updatedPublication) => {
    try {
      await editPublication(updatedPublication); 
      alert('Publikasi berhasil diupdate!');
      navigate('/publications');
    } catch (error) {
      alert('Gagal mengupdate publikasi. Silakan coba lagi.');
    }
  };

  if (!publications) { 
    return (
      <div className="text-center py-10 text-gray-600">
        Memuat data publikasi...
      </div>
    );
  }

  if (!publicationToEdit) { 
    return (
      <div className="text-center py-10 text-gray-600">
        Publikasi tidak ditemukan.
      </div>
    );
  }

  return (
    <EditPublicationPage
      publicationToEdit={publicationToEdit}
      onUpdatePublication={handleUpdatePublication}
      onCancel={handleCancelEdit}
    />
  );
}
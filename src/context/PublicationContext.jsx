// src/context/PublicationContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { publicationService } from "../services/publicationService"; // Pastikan path ini benar
import { useAuth } from "../hooks/useAuth"; // Pastikan path ini benar

const PublicationContext = createContext(null);

const PublicationProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Mengambil token dari custom hook useAuth

  // --- Mengambil data secara otomatis jika token user tersedia ---
  useEffect(() => {
    const fetchData = async () => {
      // Jika tidak ada token, jangan lakukan fetching data
      if (!token) {
        setLoading(false); // Pastikan loading menjadi false jika tidak ada token
        return;
      }

      setLoading(true); // Set loading menjadi true saat mulai fetching
      try {
        const data = await publicationService.getPublications(token); // Mengirim token jika diperlukan oleh service
        setPublications(data);
        setError(null); // Bersihkan error jika berhasil
      } catch (err) {
        console.error("Error fetching publications:", err); // Log error untuk debugging
        setError(err.message || "Failed to fetch publications."); // Set pesan error yang lebih informatif
      } finally {
        setLoading(false); // Set loading menjadi false setelah selesai (berhasil/gagal)
      }
    };

    fetchData(); // Panggil fungsi fetchData saat komponen dimuat atau token berubah
  }, [token]); // Dependency array: efek akan dijalankan ulang saat nilai token berubah

  // --- Modifikasi fungsi addPublication ---
  const addPublication = async (newPub) => {
    try {
      const added = await publicationService.addPublication(newPub, token); // Mengirim token jika diperlukan
      setPublications((prev) => [added, ...prev]);
      setError(null); // Bersihkan error jika berhasil
      return added; // Mengembalikan data publikasi yang baru ditambahkan
    } catch (err) {
      console.error("Error adding publication:", err); // Log error untuk debugging
      setError(err.message || "Failed to add publication."); // Set pesan error
      throw err; // Lempar kembali error agar bisa ditangani di komponen yang memanggil
    }
  };

  // --- Fungsi editPublication (tetap sama, bisa ditambahkan token jika API membutuhkannya) ---
  const editPublication = async (updatedPub) => {
    try {
      const updated = await publicationService.editPublication(updatedPub.id, updatedPub, token); // Asumsi service menerima id, data, dan token
      setPublications((prev) =>
        prev.map((pub) => (pub.id === updated.id ? updated : pub))
      );
      setError(null);
      return updated;
    } catch (err) {
      console.error("Error editing publication:", err);
      setError(err.message || "Failed to edit publication.");
      throw err;
    }
  };

  // --- Fungsi deletePublication (tetap sama, bisa ditambahkan token jika API membutuhkannya) ---
  const deletePublication = async (id) => {
    try {
      await publicationService.deletePublication(id, token); // Mengirim token jika diperlukan
      setPublications((prev) => prev.filter((pub) => pub.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting publication:", err);
      setError(err.message || "Failed to delete publication.");
      throw err;
    }
  };

  return (
    <PublicationContext.Provider
      value={{
        publications,
        loading,
        error,
        addPublication,
        editPublication,
        deletePublication,
      }}
    >
      {children}
    </PublicationContext.Provider>
  );
};

export { PublicationContext, PublicationProvider };
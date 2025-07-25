// src/components/AddPublicationPage.jsx
import React, { useState } from "react";
import { usePublications } from "../hooks/usePublications";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../services/publicationService"; // Pastikan path ini benar

export default function AddPublicationPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  // Mengambil fungsi addPublication dari custom hook usePublications
  const { addPublication } = usePublications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input wajib
    if (!title || !releaseDate) {
      alert("Judul dan Tanggal Rilis harus diisi!");
      return;
    }

    let coverUrl = "";
    // Jika ada file cover yang dipilih, coba upload ke Cloudinary
    if (coverFile) {
      try {
        // Panggil fungsi uploadImageToCloudinary dari service layer
        coverUrl = await uploadImageToCloudinary(coverFile);
      } catch (err) {
        // Tangani error jika upload gambar gagal
        alert("Gagal upload gambar: " + (err.message || "Terjadi kesalahan."));
        return; // Hentikan proses submit jika upload gagal
      }
    } else {
      // Jika tidak ada file cover, gunakan placeholder URL
      coverUrl = `https://placehold.co/200x280/7f8c8d/ffffff?text=${encodeURIComponent(
        title
      )}`;
    }

    // Buat objek publikasi baru
    const newPublication = {
      // id tidak perlu lagi dibuat di client jika backend yang menangani ID
      title,
      releaseDate,
      description, // Menggunakan state description
      coverUrl,
    };

    try {
      // Panggil fungsi addPublication dari context (melalui usePublications hook)
      await addPublication(newPublication);
      // Arahkan ke halaman daftar publikasi setelah berhasil
      navigate("/publications");
      // Reset form setelah berhasil submit
      setTitle("");
      setReleaseDate("");
      setDescription("");
      setCoverFile(null);
    } catch (err) {
      // Tangani error jika gagal menambah publikasi ke backend
      alert(
        "Gagal menambah publikasi: " + (err.message || "Terjadi kesalahan.")
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Form Tambah Publikasi Baru
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Judul
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Contoh: Indikator Ekonomi Gorontalo 2025"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Contoh: Publikasi ini membahas Indikator Ekonomi Gorontalo 2025 secara mendalam."
            rows={4}
          />
        </div>
        <div>
          <label
            htmlFor="releaseDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tanggal Rilis
          </label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label
            htmlFor="cover"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sampul (Gambar)
          </label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
}
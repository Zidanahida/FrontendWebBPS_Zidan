// src/components/EditPublicationPage.jsx
import React, { useState, useEffect } from 'react';

/**
 * Komponen untuk halaman edit publikasi.
 * Form ini akan terisi otomatis dengan data publikasi yang dipilih.
 * @param {object} props
 * @param {object} props.publicationToEdit - Objek publikasi yang akan diedit.
 * @param {(updatedPublication: object) => void} props.onUpdatePublication - Fungsi untuk menyimpan perubahan.
 * @param {() => void} props.onCancel - Fungsi untuk membatalkan proses edit.
 */

export default function EditPublicationPage({ publicationToEdit, onUpdatePublication, onCancel }) {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverFile, setCoverFile] = useState(null); // File baru yang dipilih pengguna
  const [description, setDescription] = useState(''); // <-- Tambahkan state untuk description
  
  // URL yang akan ditampilkan di <img>. Ini bisa dari DB atau preview file baru.
  const [displayCoverUrl, setDisplayCoverUrl] = useState(''); 

  useEffect(() => {
    if (publicationToEdit) {
      setTitle(publicationToEdit.title || '');
      setReleaseDate(publicationToEdit.releaseDate || '');
      setDescription(publicationToEdit.description || ''); // <-- Inisialisasi description
      // Inisialisasi displayCoverUrl dengan URL dari DB
      setDisplayCoverUrl(publicationToEdit.coverUrl || ''); 
      setCoverFile(null); // Reset coverFile saat publikasi berubah
    }
  }, [publicationToEdit]);

  // Efek untuk membuat URL objek sementara saat coverFile dipilih untuk preview
  useEffect(() => {
    if (coverFile) {
      const objectUrl = URL.createObjectURL(coverFile);
      setDisplayCoverUrl(objectUrl); // Update displayCoverUrl untuk preview
      return () => URL.revokeObjectURL(objectUrl); // Bersihkan URL objek saat komponen unmount atau file berubah
    } else if (publicationToEdit && !displayCoverUrl) {
      // Jika tidak ada coverFile dan displayCoverUrl kosong, 
      // set kembali ke URL dari publicationToEdit (jika ada)
      setDisplayCoverUrl(publicationToEdit.coverUrl || '');
    }
  }, [coverFile, publicationToEdit]); // Tambahkan publicationToEdit ke dependencies

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !releaseDate) {
      alert('Judul dan Tanggal Rilis tidak boleh kosong!');
      return;
    }

    // Buat objek publikasi yang sudah diperbarui
    const updatedPublication = {
      ...publicationToEdit, // Pertahankan ID dan properti lain yang tidak berubah
      title,
      releaseDate,
      description, // <-- Sertakan description
      coverFile: coverFile, // <-- PENTING: Kirim objek File jika ada yang baru
      // Tidak perlu lagi mengirim `coverUrl` langsung dari sini,
      // `publicationService` akan mengurus URL Cloudinary.
      // Cukup kirim `coverFile` (jika ada) dan `publicationToEdit.coverUrl` (URL lama)
      // publicationService akan memutuskan mana yang digunakan.
      // Kita tambahkan `currentCoverUrlFromDb` untuk memastikan URL lama tetap ada
      currentCoverUrlFromDb: publicationToEdit.coverUrl // <-- Kirim URL lama dari DB
    };

    onUpdatePublication(updatedPublication);
  };

  if (!publicationToEdit) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Edit Publikasi
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Judul */}
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
            Judul
          </label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* Input Tanggal Rilis */}
        <div>
          <label htmlFor="edit-releaseDate" className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Rilis
          </label>
          <input
            type="date"
            id="edit-releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* Input Description (Tambahkan ini jika Anda punya field description) */}
        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          ></textarea>
        </div>

        {/* Input Sampul */}
        <div>
          <label htmlFor="edit-cover" className="block text-sm font-medium text-gray-700 mb-1">
            Ganti Sampul (Gambar)
          </label>
          <div className="flex items-center space-x-4 mt-2">
            {/* Logika src yang diperbaiki untuk preview */}
            <img 
                src={displayCoverUrl || "https://placehold.co/100x140/cccccc/ffffff?text=No+Cover"} 
                alt="Sampul saat ini" 
                className="h-24 w-auto rounded shadow-md object-cover" 
                onError={(e) => { // Tambahkan onError untuk fallback
                  e.target.onerror = null; 
                  e.target.src="https://placehold.co/100x140/cccccc/ffffff?text=Error";
                }}
            />
            <input
              type="file"
              id="edit-cover"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])} // Hanya set coverFile
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />
          </div>
        </div>
        
        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
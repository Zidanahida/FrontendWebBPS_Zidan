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
  // State untuk menampung data di dalam form
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState('');

  // useEffect untuk mengisi form saat komponen pertama kali dimuat
  // atau saat 'publicationToEdit' berubah.
  useEffect(() => {
    if (publicationToEdit) {
      setTitle(publicationToEdit.title);
      setReleaseDate(publicationToEdit.releaseDate);
      setCurrentCoverUrl(publicationToEdit.coverUrl);
    }
  }, [publicationToEdit]);

  // Fungsi yang dijalankan saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !releaseDate) {
      alert('Judul dan Tanggal Rilis tidak boleh kosong!');
      return;
    }

    // Tentukan URL sampul, gunakan yang baru jika ada, jika tidak, pertahankan yang lama.
    let updatedCoverUrl = currentCoverUrl;
    if (coverFile) {
      updatedCoverUrl = URL.createObjectURL(coverFile);
    }

    // Buat objek publikasi yang sudah diperbarui
    const updatedPublication = {
      ...publicationToEdit, // Pertahankan ID dan properti lain yang tidak berubah
      title, // Timpa dengan judul baru
      releaseDate, // Timpa dengan tanggal rilis baru
      coverUrl: updatedCoverUrl, // Timpa dengan URL sampul baru
    };

    // Kirim data yang sudah diupdate ke App.jsx
    onUpdatePublication(updatedPublication);
  };

  // Jika tidak ada publikasi yang dipilih, jangan render apa pun
  // Ini untuk menghindari error saat mencoba mengakses properti dari undefined
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

        {/* Input Sampul */}
        <div>
          <label htmlFor="edit-cover" className="block text-sm font-medium text-gray-700 mb-1">
            Ganti Sampul (Gambar)
          </label>
          <div className="flex items-center space-x-4 mt-2">
              <img src={currentCoverUrl} alt="Sampul saat ini" className="h-24 w-auto rounded shadow-md object-cover" />
              <input
                type="file"
                id="edit-cover"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
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
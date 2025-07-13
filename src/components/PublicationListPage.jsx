// src/components/PublicationListPage.jsx
import React, { useContext } from "react";
import { PublicationContext } from "../context/PublicationContext";
import { useNavigate } from "react-router-dom"; // <-- PASTIKAN INI ADA

/**
 * Komponen untuk menampilkan daftar publikasi dalam tabel.
 */
export default function PublicationListPage() {
  const { publications, addPublication, editPublication, deletePublication } =
    useContext(PublicationContext);
  const navigate = useNavigate(); // <-- PASTIKAN INI ADA

  // console.log("Nilai variabel publications di PublicationListPage (dari Context):", publications);

  const handleEdit = (pub) => {
    console.log("Mengedit publikasi:", pub);
    navigate(`/publications/edit/${pub.id}`); // <-- PASTIKAN BARIS INI TIDAK DIKOMENTARI DAN SUDAH BENAR
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus publikasi ini?")) {
      deletePublication(id);
      console.log("Publikasi dengan ID", id, "dihapus.");
    }
  };

  // --- LOGIC CONDITIONAL RENDERING (Tidak ada perubahan) ---
  if (!publications) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Daftar Publikasi BPS Provinsi Bengkulu
          </h1>
          <p className="text-gray-500 mt-1">Sumber data publikasi terkini</p>
        </header>
        <div className="text-center py-10 text-gray-600">
          Memuat data publikasi...
        </div>
      </div>
    );
  }

  if (!Array.isArray(publications) || publications.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Daftar Publikasi BPS Provinsi Bengkulu
          </h1>
          <p className="text-gray-500 mt-1">Sumber data publikasi terkini</p>
        </header>
        <div className="text-center py-10 text-gray-600">
          Tidak ada publikasi yang ditemukan.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Daftar Publikasi BPS Provinsi Bengkulu
        </h1>
        <p className="text-gray-500 mt-1">Sumber data publikasi terkini</p>
      </header>
      <div className="relative overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-center w-16">No</th>
              <th scope="col" className="px-6 py-3">Judul</th>
              <th scope="col" className="px-6 py-3">Tanggal Rilis</th>
              <th scope="col" className="px-6 py-3 text-center">Sampul</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((pub, idx) => (
              <tr
                key={pub.id}
                className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 font-medium text-gray-900 text-center">{idx + 1}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{pub.title}</td>
                <td className="px-6 py-4 text-gray-600">{pub.releaseDate}</td>
                <td className="px-6 py-4 flex justify-center items-center">
                  <img
                    src={pub.coverUrl} // Menggunakan coverUrl dari data
                    alt={`Sampul ${pub.title}`}
                    className="h-24 w-auto object-cover rounded shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100x140/cccccc/ffffff?text=Error";
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(pub)}
                    className="cursor-pointer font-medium text-white bg-amber-500 hover:bg-amber-600 transform transition-transform duration-200 hover:scale-105 px-4 py-2 rounded-lg text-xs"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="cursor-pointer font-medium text-white bg-red-500 hover:bg-red-600 transform transition-transform duration-200 hover:scale-105 px-4 py-2 rounded-lg text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// src/components/RegisterPage.jsx
import React, { useState } from 'react';

// Anda bisa menggunakan logo ini atau logo lain yang lebih sesuai
const BpsLogo = () => (
  <img
    src="https://s.stis.ac.id/logoBPS"
    alt="BPS Logo"
    className="h-16 w-16 mx-auto mb-4"
  />
);

/**
 * Komponen Halaman Register
 * @param {object} props
 * @param {() => void} props.onRegisterSuccess - Fungsi yang akan dipanggil ketika registrasi berhasil (simulasi).
 * @param {() => void} props.onGoToLogin - Fungsi untuk kembali ke halaman login.
 */
const RegisterPage = ({ onRegisterSuccess, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validasi input di sisi frontend
    if (!name || !email || !password || !confirmPassword) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    // --- SIMULASI PROSES REGISTRASI (TANPA BACKEND) ---
    // Di aplikasi nyata, ini akan menjadi panggilan API ke endpoint register Laravel
    setTimeout(() => {
      // Dalam simulasi ini, kita hanya berasumsi registrasi selalu berhasil
      console.log('Registrasi berhasil (simulasi)!', { name, email, password });
      setSuccessMessage('Registrasi berhasil! Silakan login.');
      setIsLoading(false);
      
      // Arahkan kembali ke halaman login setelah beberapa saat
      setTimeout(() => {
          onGoToLogin(); 
      }, 2000); // Tunda 2 detik agar pesan sukses terlihat
      
      // Jika ingin langsung "login" setelah register, Anda bisa memanggil onRegisterSuccess di sini
      // onRegisterSuccess(); 
    }, 1500); // Simulasi delay jaringan
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <BpsLogo />
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Daftar Akun Baru
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-8">
          Buat akun untuk mengakses portal publikasi
        </p>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              {/* Input Nama */}
              <div>
                <label 
                  htmlFor="register-name" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Lengkap
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-sky-500 focus:bg-white focus:outline-none transition"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Input Email */}
              <div>
                <label 
                  htmlFor="register-email" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Alamat Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-sky-500 focus:bg-white focus:outline-none transition"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Input Password */}
              <div>
                <label 
                  htmlFor="register-password" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-sky-500 focus:bg-white focus:outline-none transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {/* Input Konfirmasi Password */}
              <div>
                <label 
                  htmlFor="register-confirm-password" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Konfirmasi Password
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-sky-500 focus:bg-white focus:outline-none transition"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {/* Pesan Error */}
              {error && (
                 <div className="text-center text-sm text-red-600 font-semibold p-2 bg-red-50 rounded-lg whitespace-pre-line">
                    {error}
                 </div>
              )}

              {/* Pesan Sukses */}
              {successMessage && (
                 <div className="text-center text-sm text-green-600 font-semibold p-2 bg-green-50 rounded-lg">
                    {successMessage}
                 </div>
              )}

              {/* Tombol Register */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoading ? 'Mendaftar...' : 'Daftar Akun'}
                </button>
              </div>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <a 
                href="#" 
                onClick={onGoToLogin} 
                className="font-medium text-sky-600 hover:text-sky-500 cursor-pointer"
              >
                Login di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
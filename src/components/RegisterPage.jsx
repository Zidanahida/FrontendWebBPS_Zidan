// src/components/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Asumsi useAuth juga memiliki registerAction

// Import ikon dari Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Anda bisa menggunakan logo ini atau logo lain yang lebih sesuai
const BpsLogo = () => (
  <img
    src="https://s.stis.ac.id/logoBPS"
    alt="BPS Logo"
    className="h-20 w-20 mx-auto mb-4"
  />
);

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Menggunakan useAuth untuk register
  // Asumsi useAuth menyediakan registerAction, error, dan isLoading
  const { registerAction, error: authError, isLoading: authLoading } = useAuth(); 
  const [localError, setLocalError] = useState(''); // Untuk validasi frontend tambahan
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(''); // Reset error lokal
    setSuccessMessage(''); // Reset pesan sukses

    // Validasi input di sisi frontend
    if (!fullName || !email || !password || !confirmPassword) {
      setLocalError('Semua kolom wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Konfirmasi password tidak cocok.');
      return;
    }

    try {
      // Panggil registerAction dari useAuth
      await registerAction(fullName, email, password); 
      setSuccessMessage('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
      // Arahkan kembali ke halaman login setelah beberapa saat
      setTimeout(() => {
        navigate('/login'); 
      }, 2000); 
    } catch (err) {
      console.error('Registrasi gagal:', err);
      // useAuth akan menangani error dan menampilkannya melalui authError
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10 transform transition-all duration-300">
        <div className="text-center mb-8">
          <BpsLogo />
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Buat akun untuk mengakses portal publikasi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Global Error Message from Auth Context */}
          {authError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center animate-fade-in">
              <div className="flex items-center justify-center">
                <FontAwesomeIcon icon={faEyeSlash} className="w-4 h-4 mr-2" />
                {authError}
              </div>
            </div>
          )}
          {/* Local Error Message (frontend validation) */}
          {localError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center animate-fade-in">
              <div className="flex items-center justify-center">
                <FontAwesomeIcon icon={faEyeSlash} className="w-4 h-4 mr-2" />
                {localError}
              </div>
            </div>
          )}
          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm text-center animate-fade-in">
              {successMessage}
            </div>
          )}

          {/* Input Nama Lengkap */}
          <div>
            <label htmlFor="register-fullName" className="sr-only">Nama Lengkap</label>
            <input
              id="register-fullName"
              type="text"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all duration-200"
              placeholder="Nama Lengkap Anda"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={authLoading}
            />
          </div>

          {/* Input Email */}
          <div>
            <label htmlFor="register-email" className="sr-only">Alamat Email</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all duration-200"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={authLoading}
            />
          </div>

          {/* Input Password */}
          <div className="relative">
            <label htmlFor="register-password" className="sr-only">Password</label>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all duration-200"
              placeholder="Password (minimal 8 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={authLoading}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          
          {/* Input Konfirmasi Password */}
          <div className="relative">
            <label htmlFor="register-confirm-password" className="sr-only">Konfirmasi Password</label>
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all duration-200"
              placeholder="Konfirmasi Password Anda"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={authLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              disabled={authLoading}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {/* Tombol Daftar Akun */}
          <div>
            <button
              type="submit"
              disabled={authLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
            >
              {authLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </span>
              ) : (
                'Daftar Akun'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-gray-600 text-base">
          <p>
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
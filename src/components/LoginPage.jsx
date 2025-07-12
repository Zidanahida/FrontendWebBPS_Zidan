// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom'; // Import Link dari react-router-dom

// Import ikon dari Font Awesome (pastikan Anda sudah install: npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk tombol lihat password
  const { loginAction, error, isLoading } = useAuth(); // Ambil isLoading dari useAuth
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!email || !password) {
      // Mengandalkan error dari useAuth atau tampilkan pesan di UI
      return;
    }
    try {
      await loginAction(email, password);
      // Redirect ke publications setelah login berhasil
      navigate('/publications');
    } catch (err) {
      console.error('Login failed:', err);
      // Error akan ditangani oleh useAuth dan ditampilkan melalui variabel 'error'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10 transform transition-all duration-300">
        <div className="text-center mb-8">
          <img
            src="https://s.stis.ac.id/logoBPS" // Logo BPS
            alt="BPS Logo"
            className="h-20 w-20 mx-auto mb-4"
          />
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Selamat Datang Kembali!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Masuk untuk mengakses portal publikasi
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center animate-fade-in">
              <div className="flex items-center justify-center">
                <FontAwesomeIcon icon={faEyeSlash} className="w-4 h-4 mr-2" /> {/* Contoh ikon error */}
                {error}
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email-address" className="sr-only">
              Alamat Email
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all duration-200"
              placeholder="Alamat Email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Password Input with Toggle */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all duration-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {/* Tombol Masuk */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform active:scale-95 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memuat...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-gray-600 text-base">
          <p>
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
              Daftar Sekarang
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
              Lupa Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
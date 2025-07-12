// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { PublicationProvider } from "./context/PublicationContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import base styles for Font Awesome

// Konfigurasi Font Awesome (Opsional, jika Anda tidak ingin Font Awesome menambah ikon ke DOM secara otomatis)
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Mencegah Font Awesome menambahkan CSS inline secara otomatis

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <PublicationProvider>
          <App />
        </PublicationProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);

// src/context/PublicationContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { publicationService } from "../services/publicationService";
import { useAuth } from "../hooks/useAuth";

const PublicationContext = createContext(null);

export const PublicationProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Tetap ambil token untuk dependency useEffect

  useEffect(() => {
    const fetchData = async () => {
      if (!token) { // Masih perlu cek token untuk memutuskan apakah fetch atau tidak
        setLoading(false);
        setPublications([]);
        return;
      }

      setLoading(true);
      try {
        const data = await publicationService.getPublications(); // <-- TANPA PARAMETER token
        setPublications(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching publications:", err);
        setError(err.message || "Failed to fetch publications.");
        setPublications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const addPublication = async (newPub) => {
    try {
      const added = await publicationService.addPublication(newPub); // <-- TANPA PARAMETER token
      setPublications((prev) => [added, ...prev]);
      setError(null);
      return added;
    } catch (err) {
      console.error("Error adding publication:", err);
      setError(err.message || "Failed to add publication.");
      throw err;
    }
  };

  const editPublication = async (updatedPub) => {
    try {
      if (!updatedPub.id) {
          throw new Error("ID Publikasi tidak ditemukan untuk diperbarui.");
      }
      const updated = await publicationService.editPublication(updatedPub.id, updatedPub); // <-- TANPA PARAMETER token
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

  const deletePublication = async (id) => {
    try {
      await publicationService.deletePublication(id); // <-- TANPA PARAMETER token
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

export { PublicationContext};
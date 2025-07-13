// src/services/publicationService.js
import apiClient from "../api/axios";

// Fungsi untuk upload gambar ke Cloudinary (ini sudah benar)
export async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
        console.error("Cloudinary config missing: cek VITE_CLOUDINARY_UPLOAD_PRESET dan VITE_CLOUDINARY_CLOUD_NAME di .env");
        throw new Error(
            "Cloudinary config missing: cek VITE_CLOUDINARY_UPLOAD_PRESET dan VITE_CLOUDINARY_CLOUD_NAME di .env"
        );
    }
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Upload gagal: ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Gagal upload ke Cloudinary:", error);
        throw new Error("Gagal upload ke Cloudinary: " + error.message);
    }
}

export const publicationService = {
    async getPublications() { // Token akan ditangani oleh interceptor apiClient
        try {
            const response = await apiClient.get("/publikasi"); 
            return response.data;
        } catch (error) {
            console.error("Error in getPublications:", error);
            throw new Error(
                "Gagal mengambil data: " + error.response?.data?.message || "Terjadi kesalahan"
            );
        }
    },

    async addPublication(newPublicationData) { // Token akan ditangani oleh interceptor apiClient
        try {
            let finalCoverUrl = null;

            if (newPublicationData.coverFile) {
                finalCoverUrl = await uploadImageToCloudinary(newPublicationData.coverFile);
            } else if (newPublicationData.coverUrl) {
                finalCoverUrl = newPublicationData.coverUrl;
            }

            const dataToSend = {
                title: newPublicationData.title,
                releaseDate: newPublicationData.releaseDate,
                description: newPublicationData.description || null, 
                coverUrl: finalCoverUrl, // Menggunakan 'coverUrl' (camelCase) sesuai DB Anda
            };

            const response = await apiClient.post("/publikasi", dataToSend); 
            return response.data;
        } catch (error) {
            console.error("Error in addPublication:", error.response?.data || error.message);
            throw new Error(
                "Gagal menambahkan data: " + error.response?.data?.message || "Terjadi kesalahan"
            );
        }
    },

    async editPublication(id, updatedPublicationData) { // Token akan ditangani oleh interceptor apiClient
        try {
            let finalCoverUrl = updatedPublicationData.currentCoverUrlFromDb; // Ambil URL lama dari DB

            // Jika ada file gambar baru, upload dulu ke Cloudinary
            if (updatedPublicationData.coverFile) {
                finalCoverUrl = await uploadImageToCloudinary(updatedPublicationData.coverFile);
            } 
            // Jika tidak ada file baru DAN currentCoverUrlFromDb adalah null/kosong,
            // berarti user menghapus gambar atau tidak pernah ada. Set ke null.
            else if (!updatedPublicationData.currentCoverUrlFromDb) {
                finalCoverUrl = null; 
            }
            // Jika tidak ada file baru dan currentCoverUrlFromDb ada isinya,
            // maka finalCoverUrl tetap menggunakan currentCoverUrlFromDb (tidak diubah)

            const dataToSend = {
                title: updatedPublicationData.title,
                releaseDate: updatedPublicationData.releaseDate,
                description: updatedPublicationData.description || null,
                coverUrl: finalCoverUrl, // Menggunakan 'coverUrl' (camelCase) sesuai DB Anda
            };
            
            const response = await apiClient.put(`/publikasi/${id}`, dataToSend); 
            
            return response.data;
        } catch (error) {
            console.error("Error in editPublication:", error.response?.data || error.message);
            throw new Error(
                "Gagal memperbarui data: " + error.response?.data?.message || "Terjadi kesalahan"
            );
        }
    },

    async deletePublication(id) { // Token akan ditangani oleh interceptor apiClient
        try {
            const response = await apiClient.delete(`/publikasi/${id}`); 
            return response.data;
        } catch (error) {
            console.error("Error in deletePublication:", error.response?.data || error.message);
            throw new Error(
                "Gagal menghapus data: " + error.response?.data?.message || "Terjadi kesalahan"
            );
        }
    },
};
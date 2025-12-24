// File: src/utils/api.js

// URL Backend Railway Anda (Jangan diubah-ubah lagi)
export const API_URL = "https://backend-production-b8f3.up.railway.app";

// Fungsi Login / Register (POST)
export const postData = async (endpoint, data) => {
    try {
        // Gabungkan URL + Endpoint (misal: /api/login)
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "Gagal terhubung ke server Backend." };
    }
};
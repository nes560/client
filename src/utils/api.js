// Ini adalah alamat Backend Anda
export const API_URL = "http://localhost:3000/api";

// Opsional: Helper function agar coding lebih singkat
export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};
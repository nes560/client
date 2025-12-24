// ✅ URL Backend Railway (Sudah benar)
export const API_URL = "https://backend-production-b8f3.up.railway.app";

// Helper Function: Untuk Mengambil Data (GET) - Contoh: List Tukang, List Pesanan
export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API GET Error:", error);
        return null;
    }
};

// Helper Function: Untuk Mengirim Data (POST) - Contoh: Login, Register
export const postData = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error("API POST Error:", error);
        return { success: false, message: "Terjadi kesalahan koneksi" };
    }
};
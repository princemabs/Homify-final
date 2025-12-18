
const API_URL = 'http://localhost:8000/api'; 

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('access_token'); 

    if (!token) return null;
const response = await fetch(`${API_URL}/auth/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    const userData = await response.json();
    return userData; 
  } catch (error) {
    console.error("Erreur profile:", error);
    return null;
  }
};
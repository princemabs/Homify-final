import React, { useEffect, useState, useMemo } from 'react';
import { Settings2, Loader2, HeartOff } from 'lucide-react';
import { FavoriteCard } from '../components/Cards';
import { Hotel } from '../types';
import { getFavorites } from '../services/propertyService'; 
import { getUserProfile } from '../services/authServices'; 

// --- Composant Filtre ---
const FilterPill = ({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick} 
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap 
      ${active 
        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
  >
    {label}
  </button>
);

interface FavProps {
  onHotelClick: (h: Hotel) => void; // C'est cette fonction qui permet d'ouvrir les détails
}

export default function FavoritesScreen({ onHotelClick }: FavProps) {
  
  // États
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Utilisateur");
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // --- Chargement initial ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const favData = await getFavorites();
        if (favData) setFavorites(favData);
        else setFavorites([]);

        const userData = await getUserProfile();
        if (userData) {
          const displayName = userData.first_name || userData.username || "Utilisateur";
          setUserName(displayName.charAt(0).toUpperCase() + displayName.slice(1));
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRemoveFavorite = async (propertyId: number) => {
    const previousFavorites = [...favorites];
    setFavorites(prev => prev.filter(h => h.id !== propertyId));

    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:8000/api/favorites/${propertyId}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Erreur API");

    } catch (error) {
        console.error("Erreur suppression", error);
        setFavorites(previousFavorites);
        alert("Impossible de supprimer le favori pour l'instant.");
    }
  };

  const filteredFavorites = useMemo(() => {
    if (activeFilter === 'ALL') return favorites;
    return favorites.filter(item => item.type === activeFilter);
  }, [favorites, activeFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen pb-24">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white px-4 pt-4 animate-in slide-in-from-right-10 duration-300 pb-24 overflow-y-auto custom-scrollbar">

      <div className="flex justify-between items-center mb-6">
         <div>
            <p className="text-gray-400 text-sm">Bonjour,</p>
            <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
         </div>
         <button className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-full transition">
            <Settings2 className="w-6 h-6" />
         </button>
      </div>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-gray-900">Vos Favoris</h2>
        <span className="text-blue-600 text-sm font-semibold bg-blue-50 px-2 py-1 rounded-md">
          {filteredFavorites.length} {filteredFavorites.length > 1 ? 'biens' : 'bien'}
        </span>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
        <FilterPill label="Tous" active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
        <FilterPill label="Appartements" active={activeFilter === 'APARTMENT'} onClick={() => setActiveFilter('APARTMENT')} />
        <FilterPill label="Maisons" active={activeFilter === 'HOUSE'} onClick={() => setActiveFilter('HOUSE')} />
        <FilterPill label="Chambres" active={activeFilter === 'ROOM'} onClick={() => setActiveFilter('ROOM')} />
      </div>

      {/* Liste */}
      {error && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-center mb-4 text-sm">{error}</div>}

      {filteredFavorites.length === 0 && !loading && !error ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 h-full">
           <div className="bg-gray-50 p-6 rounded-full mb-4">
             <HeartOff className="w-12 h-12 text-gray-300" />
           </div>
           <p className="text-center">Aucun favori trouvé.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
           {filteredFavorites.map((hotel) => (
              <div key={hotel.id} className="w-full">
                <FavoriteCard 
                  hotel={hotel} 

                  onClick={() => onHotelClick(hotel)} 
                  

                  onToggleFavorite={() => handleRemoveFavorite(hotel.id)} 
                />
              </div>
           ))}
        </div>
      )}
    </div>
  );
}
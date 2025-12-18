// Fichier: src/screens/HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Map as MapIcon, List, Menu, UserCircle, 
  Heart, BedDouble, Bath, Loader2, ArrowUpDown, 
  Maximize
} from 'lucide-react';
import { usePropertySearch } from '../hooks/usePropertySearch';
import PriceMap from '../components/PriceMap'; 
import RightNavbar from '../components/RightNavbar';

// --- Composant Helper (Bouton Filtre) ---
const FilterPill = ({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'}`}>
    {label}
    {active && <span className="ml-1 text-xs">✕</span>}
  </button>
);

interface HomeScreenProps {
  onPropertyClick: (id: number) => void;
}

export default function HomeScreen({ onPropertyClick }: HomeScreenProps) {
  // --- États UI ---
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- État pour les favoris (Optimistic UI) ---
  // Stocke les changements locaux temporaires : { id_logement: true/false }
  // Cela permet au coeur de changer de couleur INSTANTANÉMENT sans attendre le serveur
  const [localFavorites, setLocalFavorites] = useState<Record<number, boolean>>({});

  // --- Hook de recherche ---
  const { properties, loading, filters, updateFilter, loadMore, hasNextPage, totalCount } = usePropertySearch();

  // --- Scroll Infini ---
  const observerTarget = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem('access_token');
  useEffect(() => {
    if (loading || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, hasNextPage, loadMore]);


  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setViewMode('list'); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  const isFavorite = (prop: any) => {
    if (localFavorites[prop.id] !== undefined) {
        return localFavorites[prop.id];
    }
    return prop.is_favorite; 
  };
const handleToggleFavorite = async (e: React.MouseEvent, propertyId: number, currentStatus: boolean) => {
    e.stopPropagation(); 
    
    setLocalFavorites(prev => ({ ...prev, [propertyId]: !currentStatus }));

    try {
        const response = await fetch(`http://localhost:8000/api/favorites/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ property_id: propertyId }),
        });

        if (!response.ok) {
            throw new Error('Erreur API');
        }

    } catch (error) {
        console.error("Erreur lors de la mise en favoris", error);
        // C. Si ça plante, on annule le changement visuel (rollback)
        setLocalFavorites(prev => ({ ...prev, [propertyId]: currentStatus }));
        alert("Impossible de modifier les favoris pour l'instant.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white relative">
      <RightNavbar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} viewMode={viewMode} setViewMode={setViewMode} />

      {/* HEADER */}
      <header className="flex-none border-b border-gray-200 bg-white z-30 sticky top-0 shadow-sm">
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-4 max-w-7xl mx-auto">
            <div className="flex-1 flex items-center shadow-sm border border-gray-300 rounded-full hover:shadow-md transition p-2 bg-white">
              <input 
                type="text" 
                placeholder="Rechercher une ville, un quartier..." 
                className="flex-1 ml-4 outline-none text-sm bg-transparent" 
                value={filters.search} 
                onChange={(e) => updateFilter('search', e.target.value)} 
              />
              <button className="bg-blue-600 p-2 rounded-full text-white mr-1"><Search size={16} /></button>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 flex items-center gap-2">
               <Menu size={20} className="text-gray-600" /><UserCircle size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-3 md:pt-4 max-w-7xl mx-auto scrollbar-hide">
            <FilterPill label="Appartement" active={filters.type === 'APARTMENT'} onClick={() => updateFilter('type', filters.type === 'APARTMENT' ? '' : 'APARTMENT')} />
            <FilterPill label="Maison" active={filters.type === 'HOUSE'} onClick={() => updateFilter('type', filters.type === 'HOUSE' ? '' : 'HOUSE')} />
            <FilterPill label="Chambre" active={filters.type === 'ROOM'} onClick={() => updateFilter('type', filters.type === 'ROOM' ? '' : 'ROOM')} />
            <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-500 pointer-events-none"><ArrowUpDown size={14} /></div>
              <select 
                className="appearance-none pl-9 pr-8 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 hover:shadow-sm outline-none cursor-pointer focus:border-blue-500 transition-all"
                value={filters.ordering || ''}
                onChange={(e) => updateFilter('ordering', e.target.value)}
              >
                <option value="">Pertinence</option>
                <option value="monthly_rent">Prix croissant</option>
                <option value="-monthly_rent">Prix décroissant</option>
                <option value="-created_at">Plus récents</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* LISTE DES LOGEMENTS */}
        <div className={`flex-1 h-full overflow-y-auto custom-scrollbar pb-20 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg font-bold text-gray-800">
                {loading && properties.length === 0 ? 'Recherche en cours...' : `${totalCount} logements trouvés`}
              </h1>
            </div>
            
            {/* Chargement initial */}
            {loading && properties.length === 0 ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-8 h-8"/></div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                  {properties.map((prop) => {
                    const isFav = isFavorite(prop); // Vérification état favori

                    return (
                        <div 
                        key={prop.id}
                        onMouseEnter={() => setActiveId(prop.id)}
                        onMouseLeave={() => setActiveId(null)}
                        onClick={() => onPropertyClick(prop.id)}
                        className="group cursor-pointer flex flex-col h-full bg-white rounded-xl hover:shadow-lg transition-all border border-transparent hover:border-gray-100"
                        >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-200 mb-3">
                            <img src={prop.primary_photo?.url || '/placeholder-house.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={prop.title} />
                            
                            {/* --- BOUTON COEUR --- */}
                            <button 
                                onClick={(e) => handleToggleFavorite(e, prop.id, isFav)}
                                className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 shadow-sm ${
                                    isFav 
                                    ? 'bg-red-50 text-red-500 hover:bg-red-100' // Style si favori
                                    : 'bg-white/70 text-gray-600 hover:bg-white' // Style par défaut
                                }`}
                            >
                                <Heart 
                                    size={18} 
                                    className={`transition-all duration-200 ${isFav ? 'fill-current scale-110' : ''}`} 
                                />
                            </button>
                            {/* -------------------- */}

                            <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                            {prop.type === 'APARTMENT' ? 'Appartement' : prop.type === 'HOUSE' ? 'Maison' : 'Chambre'}
                            </div>
                        </div>
                        <div className="flex-1 px-1">
                            <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-gray-900 truncate text-lg flex-1 mr-2">{prop.title}</h3>
                            </div>
                            <p className="text-gray-500 text-sm mb-3 truncate flex items-center gap-1">
                            <MapIcon size={14} className="inline"/> {prop.address.full_address}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                            <span className="flex items-center gap-1.5"><BedDouble size={16} className="text-blue-600"/> {prop.number_of_bedrooms || 0} Ch.</span>
                            <span className="flex items-center gap-1.5"><Bath size={16} className="text-blue-600"/> {prop.number_of_rooms} Pcs.</span>
                            <span className="flex items-center gap-1.5"><Maximize size={16} className="text-blue-600"/> {prop.surface} m²</span>
                            </div>
                            
                            <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3">
                            <div className="font-bold text-xl text-blue-900">
                                {parseInt(prop.monthly_rent).toLocaleString('fr-FR')} <span className="text-sm">FCFA</span>
                                <span className="text-xs font-normal text-gray-400 ml-1">/ mois</span>
                            </div>
                            <span className="text-xs text-blue-600 font-semibold px-2 py-1 bg-blue-50 rounded">Voir détails</span>
                            </div>
                        </div>
                        </div>
                    );
                  })}
                </div>

                {/* --- ELEMENT SENTINELLE POUR SCROLL INFINI --- */}
                <div ref={observerTarget} className="mt-8 flex justify-center py-6 h-20">
                    {loading && properties.length > 0 && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 className="animate-spin text-blue-600 w-6 h-6"/>
                            <span className="text-sm font-medium">Chargement de la suite...</span>
                        </div>
                    )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* CARTE ET BOUTONS MOBILES */}
        <div className={`absolute inset-0 z-20 bg-gray-100 md:static md:block md:w-[40%] ${viewMode === 'map' ? 'block' : 'hidden'}`}>
          <PriceMap properties={properties} activeId={activeId} onMarkerClick={(id) => onPropertyClick(id)} />
           <button onClick={() => setViewMode('list')} className="md:hidden absolute top-4 left-4 z-[1000] bg-white p-3 rounded-full shadow-lg"><List size={24} /></button>
        </div>
        
        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
           <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transform hover:scale-105 transition">
             {viewMode === 'list' ? <> <MapIcon size={18} /> Carte </> : <> <List size={18} /> Liste </>}
           </button>
        </div>
      </main>
    </div>
  );
}
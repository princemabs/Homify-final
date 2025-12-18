import React, { useState, useEffect } from 'react';
import { 
  Search, Map as MapIcon, List, SlidersHorizontal, ChevronDown, 
  Heart, Star, BedDouble, Bath, Maximize, Loader2 
} from 'lucide-react';
import { usePropertySearch } from '../hooks/usePropertySearch';
import PriceMap from '../components/PriceMap'; 
import RightNavbar from '../components/RightNavbar';

// --- Composant Filtre Simple ---
const FilterPill = ({ 
  label, 
  active = false, 
  onClick 
}: { 
  label: string, 
  active?: boolean, 
  onClick?: () => void 
}) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap
      ${active 
        ? 'border-blue-600 bg-blue-50 text-blue-700' 
        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'}
    `}
  >
    {label}
    {active && <span className="ml-1 text-xs">✕</span>}
  </button>
);

export default function SearchScreen() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  

  // --- Utilisation du Hook API ---
  const { 
    properties, 
    loading, 
    filters, 
    updateFilter, 
    loadMore, 
    hasNextPage,
    totalCount 
  } = usePropertySearch();

  // Resize handler pour le responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setViewMode('list');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      
      {/* --- HEADER (Recherche & Filtres) --- */}
      <header className="flex-none border-b border-gray-200 bg-white z-30 sticky top-0">
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-4 max-w-7xl mx-auto">
            
          
            {/* Barre de recherche (Lier à l'API) */}
            <div className="flex-1 flex items-center shadow-sm border border-gray-300 rounded-full hover:shadow-md transition p-2 bg-white">
              <input 
                type="text"
                placeholder="Rechercher (ex: Bastos, Appartement...)"
                className="flex-1 ml-4 outline-none text-sm text-gray-700 placeholder-gray-500"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
              <button className="bg-blue-600 p-2 rounded-full text-white mr-1 hover:bg-blue-700">
                <Search size={16} />
              </button>
            </div>

            {/* Bouton Tri (Ordering) */}
            <select 
              className="hidden md:block border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold bg-white outline-none focus:ring-2 focus:ring-blue-100"
              onChange={(e) => updateFilter('ordering', e.target.value)}
              value={filters.ordering}
            >
              <option value="-created_at">Plus récents</option>
              <option value="monthly_rent">Prix croissant</option>
              <option value="-monthly_rent">Prix décroissant</option>
            </select>
          </div>

          {/* --- BARRE DE FILTRES RAPIDES --- */}
          <div className="flex gap-3 overflow-x-auto pb-2 pt-3 md:pt-4 max-w-7xl mx-auto scrollbar-hide">
            {/* Exemples de filtres connectés */}
            <FilterPill 
              label="Appartement" 
              active={filters.type === 'APARTMENT'}
              onClick={() => updateFilter('type', filters.type === 'APARTMENT' ? '' : 'APARTMENT')}
            />
             <FilterPill 
              label="Maison" 
              active={filters.type === 'HOUSE'}
              onClick={() => updateFilter('type', filters.type === 'HOUSE' ? '' : 'HOUSE')}
            />
            <FilterPill 
              label="Meublé" 
              active={filters.furnished === true}
              onClick={() => updateFilter('furnished', filters.furnished ? '' : true)}
            />
             <select 
                className="border border-gray-200 rounded-full px-4 py-2 text-sm bg-white"
                onChange={(e) => updateFilter('city', e.target.value)}
                value={filters.city || ''}
             >
               <option value="">Toutes les villes</option>
               <option value="Yaoundé">Yaoundé</option>
               <option value="Douala">Douala</option>
             </select>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* LISTE (Scrollable) */}
        <div className={`flex-1 h-full overflow-y-auto custom-scrollbar pb-20 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 md:p-6">
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                {totalCount > 0 ? `${totalCount} logements trouvés` : 'Aucun logement trouvé'}
              </h1>
            </div>

            {/* Loading State Initial */}
            {loading && filters.page === 1 ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-8 h-8"/></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {properties.map((prop) => (
                  <div 
                    key={prop.id}
                    onMouseEnter={() => setActiveId(prop.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className="group cursor-pointer flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-200 mb-3">
                      <img 
                        src={prop.primary_photo?.url || '/placeholder-house.jpg'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        alt={prop.title}
                      />
                      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/70 hover:bg-white transition">
                        <Heart size={18} className={prop.is_favorite ? "fill-red-500 text-red-500" : "text-gray-700"} />
                      </button>
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <h3 className="font-bold text-gray-900 truncate">{prop.title}</h3>
                          <p className="text-gray-500 text-sm mb-1 truncate">{prop.address.full_address}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                             <span className="flex items-center gap-1"><BedDouble size={14}/> {prop.number_of_bedrooms || 0} ch.</span>
                             <span className="flex items-center gap-1"><Bath size={14}/> {prop.number_of_rooms} pcs</span>
                             <span className="flex items-center gap-1"><Maximize size={14}/> {prop.surface} m²</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-bold text-lg text-blue-900">
                          {parseInt(prop.monthly_rent).toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-gray-500 text-sm">/ mois</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination / Load More */}
            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4"/> : 'Voir plus d\'annonces'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CARTE (Fixe Desktop) */}
        <div className={`
          absolute inset-0 z-20 bg-gray-100 md:static md:block md:w-[45%] lg:w-[40%] xl:w-[35%] border-l border-gray-200
          ${viewMode === 'map' ? 'block' : 'hidden'}
        `}>
          <PriceMap 
             properties={properties} // Passe les vraies propriétés
             activeId={activeId}
             onMarkerClick={(id) => { console.log('Marker clicked', id); }}
          />
           {/* Bouton retour liste (Mobile) */}
           <button 
             onClick={() => setViewMode('list')}
             className="md:hidden absolute top-4 left-4 z-[1000] bg-white p-3 rounded-full shadow-lg text-gray-700"
          >
             <List size={24} />
          </button>
        </div>

        {/* Bouton Toggle Mobile */}
        <div className="md:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
           <button 
             onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
             className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2"
           >
             {viewMode === 'list' ? <> <MapIcon size={18} /> Carte </> : <> <List size={18} /> Liste </>}
           </button>
        </div>

      </main>
    </div>
  );
}

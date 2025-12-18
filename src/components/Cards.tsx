import React from 'react';
import { Heart, Star, MapPin, Bath, SlidersHorizontal, BedDouble } from 'lucide-react';
import { Hotel } from '../types';
import { PropertyImage } from './PropertyImage'; 

interface CardProps {
  hotel: Hotel;
  onClick: () => void;
  onToggleFavorite?: () => void;
}

export const RecommendedCard = ({ hotel, onClick, onToggleFavorite }: CardProps) => (
  <div onClick={onClick} className="min-w-[260px] bg-gray-200 p-3 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group">
    <div className="relative mb-3 bg-gray-200 overflow-hidden rounded-xl h-40">
      
      <PropertyImage 
        src={hotel.imageUrl} 
        alt={hotel.name} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300" 
      />

      {/* Bouton Coeur Interactif */}
      <button 
        onClick={(e) => {
            e.stopPropagation(); // Empêche d'ouvrir les détails
            if (onToggleFavorite) onToggleFavorite();
        }}
        className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:text-red-500 hover:bg-gray-50 transition z-10"
      >
        {/* Ici, tu pourras aussi conditionner la couleur si besoin (ex: hotel.isFavorite) */}
        <Heart className={`w-4 h-4 ${hotel.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
      </button>
    </div>
    
    <div className="flex justify-between items-start mb-1">
      <h3 className="font-bold text-gray-800 text-lg truncate pr-2">{hotel.name}</h3>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium text-gray-600">{hotel.rating}</span>
      </div>
    </div>
    <div className="flex items-center text-gray-500 text-sm mb-2"><MapPin className="w-3 h-3 mr-1" />{hotel.location}</div>
    <div className="flex items-end gap-1">
      <span className="font-bold text-gray-900 text-lg">{hotel.displayPrice || `$${hotel.price}`}</span>
    </div>
  </div>
);

// --- C'est ici que la suppression se joue ---
export const FavoriteCard = ({ hotel, onClick, onToggleFavorite }: CardProps) => (
  <div onClick={onClick} className="mb-6 cursor-pointer group relative">
    <div className="relative h-64 rounded-3xl overflow-hidden mb-4 shadow-md bg-gray-100">
      
      <PropertyImage 
        src={hotel.imageUrl} 
        alt={hotel.name} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" 
      />

      {/* MODIFICATION : C'est maintenant un bouton clickable */}
      <button 
        onClick={(e) => {
            e.stopPropagation(); 
            if (onToggleFavorite) onToggleFavorite();
        }}
        className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full z-20 transition-all hover:scale-110 shadow-sm"
        title="Retirer des favoris"
      >
         {/* Dans la FavoriteCard, le cœur est toujours rouge par défaut */}
         <Heart className="w-5 h-5 text-red-500 fill-red-500" />
      </button>

      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl z-10">
         <span className="text-white font-bold">{hotel.displayPrice ? hotel.displayPrice : `$${hotel.price}`}</span>
      </div>
    </div>
    
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
      <p className="text-gray-500 text-sm mb-3 flex items-center gap-1"><MapPin className="w-4 h-4" /> {hotel.location}</p>
      <div className="flex gap-6 text-gray-600 text-sm font-medium">
         <span className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-gray-400" /> {hotel.amenities?.beds ?? 0} Beds</span>
         <span className="flex items-center gap-2"><Bath className="w-5 h-5 text-gray-400" /> {hotel.amenities?.baths ?? 1} Baths</span>
         {hotel.amenities?.sqft && (
           <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-gray-400 rotate-90" /> {hotel.amenities.sqft} m²</span>
         )}
      </div>
    </div>
  </div>
);
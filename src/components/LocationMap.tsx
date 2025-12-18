import React from "react";
import { MapPin, Star } from "lucide-react";

// Image de fond style carte neutre
const MAP_BG = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80";

const LocationMap = ({ properties, activeId, onPinClick }) => {
  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-2xl overflow-hidden shadow-inner border border-gray-300">
      
      {/* Background Map Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${MAP_BG})` }}
      />
      <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />

      {/* Simulated Pins */}
      {properties.map((prop, index) => {
        // Simulation de coordonnées aléatoires pour la démo 
        // (En prod, tu utiliseras prop.lat et prop.lng)
        const top = 20 + (index * 15) + "%"; 
        const left = 30 + (index * 20) + "%";
        
        const isActive = activeId === prop.id;

        return (
          <div 
            key={prop.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 z-10"
            style={{ top, left }}
            onClick={() => onPinClick(prop.id)}
          >
            {/* L'étiquette Prix (La Puce) */}
            <div 
              className={`
                px-3 py-1.5 rounded-full font-bold text-sm shadow-md transition-all duration-300 flex items-center gap-1
                ${isActive 
                  ? "bg-blue-600 text-white scale-125 z-50 ring-4 ring-blue-600/30" 
                  : "bg-white text-gray-900 hover:scale-110 hover:bg-gray-50"
                }
              `}
            >
              {isActive ? <MapPin size={12} fill="currentColor" /> : null}
              {prop.price}
            </div>

            {/* Tooltip au survol (Propriété) */}
            <div className={`
              absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-xl shadow-xl overflow-hidden pointer-events-none transition-all duration-300
              ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}>
              <img src={prop.image} alt="" className="w-full h-24 object-cover" />
              <div className="p-2">
                <h4 className="font-bold text-gray-900 text-xs truncate">{prop.title}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400 mr-1" />
                  {prop.rating}
                </div>
              </div>
              {/* Petite flèche en bas */}
              <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
            </div>
          </div>
        );
      })}

      {/* Contrôles Zoom factices */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
         <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center font-bold text-xl text-gray-600 hover:bg-gray-50">+</button>
         <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center font-bold text-xl text-gray-600 hover:bg-gray-50">-</button>
      </div>
    </div>
  );
};

export default LocationMap;

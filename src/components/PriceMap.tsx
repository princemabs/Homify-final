import React, { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Hotel } from "../types";

// --- Fix Icônes ---
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Composant pour recentrer la carte automatiquement ---
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface Props {
  properties: Hotel[];
  activeId: number | null; 
  onMarkerClick: (id: number) => void;
}

export default function PriceMap({ properties, activeId, onMarkerClick }: Props) {
  
  
  const createPriceIcon = (priceString: string, isSelected: boolean) => {
    const price = parseInt(priceString.replace(/\s/g, '')).toLocaleString('fr-FR');
    
    // Styles dynamiques
    const bgColor = isSelected ? '#1e3a8a' : 'white'; // Bleu foncé vs Blanc
    const textColor = isSelected ? 'white' : '#1e3a8a';
    const zIndex = isSelected ? 1000 : 1; 
    const scale = isSelected ? 'scale(1.1)' : 'scale(1)';

    return L.divIcon({
      className: "custom-price-marker",
      iconSize: [60, 28],
      iconAnchor: [30, 14],
      html: `
        <div style="
          background-color: ${bgColor}; 
          border: 1px solid #1e3a8a; 
          color: ${textColor}; 
          font-weight: bold; 
          font-size: 11px; 
          padding: 3px 6px; 
          border-radius: 20px; 
          box-shadow: 0 3px 6px rgba(0,0,0,0.3); 
          text-align: center; 
          white-space: nowrap;
          transition: all 0.2s ease;
          transform: ${scale};
          position: relative;
          z-index: ${zIndex};
        ">
            ${price} F
        </div>
      `,
    });
  };

  const markers = useMemo(() => {
    return properties.map((p) => {
      const lat = p.latitude || (p.address && p.address.latitude); 
      const lng = p.longitude || (p.address && p.address.longitude);

      if (!lat || !lng) return null;

      const isSelected = activeId === p.id;

      return (
        <Marker
          key={p.id}
          position={[lat, lng]}
          icon={createPriceIcon(p.monthly_rent.toString(), isSelected)}
          eventHandlers={{
            click: () => onMarkerClick(p.id),
            mouseover: (e) => e.target.openPopup(), // Optionnel : ouvre popup au survol
          }}
          zIndexOffset={isSelected ? 1000 : 0} 
        >
          <Popup closeButton={false}>
             <div className="font-bold text-gray-800">{p.name}</div>
          </Popup>
        </Marker>
      );
    });
  }, [properties, activeId]);

  return (
    <div className="w-full h-full bg-gray-100  z-0">
      <MapContainer 
        center={[3.8480, 11.5021]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer 
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
        {markers}
        {/* Contrôleur pour bouger la carte si besoin */}
        {/* <MapController center={...} zoom={...} /> */} 
      </MapContainer>
    </div>
  );
}

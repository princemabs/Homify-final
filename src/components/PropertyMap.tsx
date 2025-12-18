
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

const iconHTML = ReactDOMServer.renderToString(
  <div className="relative flex items-center justify-center w-10 h-10">
    <div className="absolute inset-0 bg-blue-900 rounded-full opacity-20 animate-ping"></div>
    <div className="relative z-10 bg-blue-900 p-2 rounded-full shadow-lg border-2 border-white">
      <MapPin className="text-white w-5 h-5" fill="currentColor" />
    </div>
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-900 rotate-45 border-r-2 border-b-2 border-white z-0"></div>
  </div>
);

const customMarkerIcon = new L.DivIcon({
  html: iconHTML,
  className: 'custom-leaflet-icon', 
  iconSize: [40, 40],
  iconAnchor: [20, 40], 
  popupAnchor: [0, -40]
});


interface PropertyMapProps {
  lat: number;
  lng: number;
  address?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ lat, lng, address }) => {
  // Protection contre les coordonnées invalides (ex: 0,0)
  if (!lat || !lng || (lat === 0 && lng === 0)) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 flex-col gap-2">
        <MapPin size={30} className="text-gray-300"/>
        <p className="text-sm">Localisation indisponible</p>
      </div>
    );
  }

  return (
    
    <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={customMarkerIcon}>
        {address && <Popup className="font-medium text-sm">{address}</Popup>}
      </Marker>
    </MapContainer>
  );
};
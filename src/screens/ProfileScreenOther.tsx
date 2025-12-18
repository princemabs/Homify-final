import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Edit3, Settings, Share2, 
  MessageCircle, Star, Home, Phone, Mail, CheckCircle 
} from 'lucide-react';
import PriceMap from '../components/PriceMap'; // On réutilise ta carte
import { Loader2 } from 'lucide-react';

// --- Types simulés (à remplacer par ton API) ---
interface UserProfile {
  id: number;
  name: string;
  role: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  joinedDate: string;
  stats: {
    listings: number;
    rating: number;
    reviews: number;
  };
  isVerified: boolean;
}

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'about'>('listings');
  
  // Simulation: Est-ce que c'est MON profil ? (Mets false pour tester la vue visiteur)
  const isOwnProfile = true; 

  // Données Mockées (Utilisateur)
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Données Mockées (Ses propriétés)
  const [userProperties, setUserProperties] = useState<any[]>([]);

  useEffect(() => {
    // Simulation chargement API
    setTimeout(() => {
      setUser({
        id: 1,
        name: "Jean Dupont",
        role: "Agent Immobilier & Hôte",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        coverImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        bio: "Passionné par l'immobilier au Cameroun. J'aide les gens à trouver le logement de leurs rêves à Yaoundé et Douala. Disponible 7j/7.",
        location: "Yaoundé, Bastos",
        joinedDate: "Membre depuis Janvier 2023",
        stats: { listings: 12, rating: 4.8, reviews: 156 },
        isVerified: true
      });

      // On simule 3 propriétés pour la carte et la liste
      setUserProperties([
        {
          id: 101,
          title: "Villa Moderne Bastos",
          monthly_rent: "450000",
          address: { full_address: "Bastos, Yaoundé", lat: 3.8480, lng: 11.5021 },
          primary_photo: { url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80" },
          number_of_bedrooms: 4,
          number_of_rooms: 6,
          surface: 250
        },
        {
          id: 102,
          title: "Appartement Luxueux",
          monthly_rent: "250000",
          address: { full_address: "Omnisport, Yaoundé", lat: 3.8667, lng: 11.5167 },
          primary_photo: { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" },
          number_of_bedrooms: 2,
          number_of_rooms: 3,
          surface: 120
        },
        {
          id: 103,
          title: "Studio Meublé",
          monthly_rent: "100000",
          address: { full_address: "Mvan, Yaoundé", lat: 3.8300, lng: 11.5000 },
          primary_photo: { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
          number_of_bedrooms: 1,
          number_of_rooms: 1,
          surface: 45
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8"/></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* --- 1. HERO SECTION (Cover + Avatar) --- */}
      <div className="bg-white shadow-sm pb-4">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full relative bg-gray-300 overflow-hidden">
          <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
          {isOwnProfile && (
            <button className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition">
               <Edit3 size={18} />
            </button>
          )}
        </div>

        {/* Profile Info Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 mb-6 gap-6">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              {user.isVerified && (
                <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white" title="Compte vérifié">
                  <CheckCircle size={16} />
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 mt-2 md:mt-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 font-medium">{user.role}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {user.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {user.joinedDate}</span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3">
                  {isOwnProfile ? (
                    <>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition">
                        <Edit3 size={18} /> 
                        <span>Modifier</span>
                      </button>
                      <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        <Settings size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition">
                        <MessageCircle size={18} /> 
                        <span>Contacter</span>
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Share2 size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex border-t border-gray-100 pt-4 gap-8">
            <div className="flex items-center gap-2">
               <span className="font-bold text-xl text-gray-900">{user.stats.listings}</span>
               <span className="text-gray-500 text-sm">Propriétés</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="font-bold text-xl text-gray-900">{user.stats.rating}</span>
               <div className="flex text-yellow-400"><Star size={16} fill="currentColor" /></div>
               <span className="text-gray-500 text-sm">({user.stats.reviews} avis)</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. MAIN CONTENT GRID (List left, Map right) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE (Liste des biens) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">À propos</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {user.bio}
              </p>
              
              {!isOwnProfile && (
                <div className="mt-4 flex gap-4 text-sm text-blue-900 font-medium">
                   <div className="flex items-center gap-2"><Phone size={16}/> Voir le numéro</div>
                   <div className="flex items-center gap-2"><Mail size={16}/> Envoyer un email</div>
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Home size={20} />
              Propriétés ({userProperties.length})
            </h3>

            {/* Liste des cartes */}
            <div className="space-y-4">
              {userProperties.map((prop) => (
                <div key={prop.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex gap-4">
                  {/* Petite image */}
                  <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={prop.primary_photo.url} className="w-full h-full object-cover" alt={prop.title} />
                  </div>
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                     <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{prop.address.full_address}</p>
                     </div>
                     <div className="flex justify-between items-end">
                        <div className="text-blue-900 font-bold">{parseInt(prop.monthly_rent).toLocaleString()} FCFA <span className="text-xs text-gray-400 font-normal">/mois</span></div>
                        <button className="text-xs px-3 py-1 bg-gray-100 rounded-full font-medium hover:bg-gray-200">Voir</button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLONNE DROITE (Carte Sticky) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[500px]">
               <div className="p-4 border-b border-gray-100 font-bold text-gray-900">
                 Localisation des biens
               </div>
               <div className="h-full">
                  {/* On passe la liste des propriétés de l'user à la map */}
                  <PriceMap properties={userProperties} activeId={null} onMarkerClick={(id) => console.log(id)} />
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
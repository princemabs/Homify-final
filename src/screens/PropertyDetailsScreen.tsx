import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Heart, Star, MapPin, Bath, Utensils, 
  MessageCircle, MessageSquare, Loader2, AlertCircle, 
  BedDouble, Maximize, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { PropertyMap } from '../components/PropertyMap';
//import { ChatInitData } from '../App';

// --- TYPES ---
interface PropertyData {
  id: number;
  title: string;
  price: string;
  description: string;
  address: string;
  rating: number;
  reviewCount: number;
  features: { beds: number; baths: number; surface: number; kitchen: number };
  images: string[];
  primaryImage: string;
  coordinates?: { lat: number; lng: number };
  owner: { name: string; avatar: string; role?: string };
  is_favorite?: boolean; 
}

interface DetailsProps {
  propertyId: number;
  onBack: () => void;
  onBookNow: () => void;
}

export default function PropertyDetailsScreen({ propertyId, onBack, onBookNow }: DetailsProps) {
  // --- ÉTATS ---
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // États favoris
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // États UI
  const [activeTab, setActiveTab] = useState<'About' | 'Gallery' | 'Review'>('About');
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);
  const API_URL = 'http://localhost:8000/api';

  // 1. CHARGEMENT DONNÉES
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/properties/${propertyId}/`, { headers });
        if (!response.ok) throw new Error("Erreur chargement");
        
        const data = await response.json();
        
        const primaryUrl = data.primary_photo?.url || '/placeholder-house.jpg';
        const imagesList = data.photos && data.photos.length > 0 
            ? data.photos.map((p: any) => p.url) 
            : [primaryUrl];
            
        const ownerData = data.owner || data.landlord;
        let ownerName = "Propriétaire";
        let ownerAvatar = "https://i.pravatar.cc/150?u=default";
        if (ownerData) {
            if (ownerData.first_name && ownerData.last_name) ownerName = `${ownerData.first_name} ${ownerData.last_name}`;
            else if (ownerData.username) ownerName = ownerData.username;
            if (ownerData.profile_photo?.url) ownerAvatar = ownerData.profile_photo.url;
        }

        setProperty({
          id: data.id,
          title: data.title,
          price: parseInt(data.monthly_rent).toLocaleString('fr-FR'),
          description: data.description || "Aucune description.",
          address: data.address?.full_address || 'Adresse inconnue',
          rating: 4.5, 
          reviewCount: 365,
          features: {
            beds: data.number_of_bedrooms || 0,
            baths: data.number_of_rooms || 1,
            surface: data.surface || 0,
            kitchen: 1
          },
          images: imagesList,
          primaryImage: primaryUrl,
          coordinates: (data.address?.latitude && data.address?.longitude) ? {
            lat: parseFloat(data.address.latitude),
            lng: parseFloat(data.address.longitude)
          } : undefined,
          owner: { name: ownerName, avatar: ownerAvatar, role: "Hôte" },
          is_favorite: data.is_favorite 
        });

        if (data.is_favorite) setIsFavorite(true);

      } catch (err) {
        console.error(err);
        setError("Impossible de charger les détails.");
      } finally {
        setLoading(false);
      }
    };
    if (propertyId) fetchDetails();
  }, [propertyId]);


  // 2. GESTION DES FAVORIS
  const handleToggleFavorite = async (e: React.MouseEvent) => {
   
    e.preventDefault(); 
    e.stopPropagation(); 
    e.nativeEvent.stopImmediatePropagation();
    

    const token = localStorage.getItem('access_token');
    if (!token) {
        alert("Veuillez vous connecter pour gérer vos favoris.");
        return;
    }

    if (favLoading) return;

    const previousState = isFavorite;
    setIsFavorite(!previousState); 
    setFavLoading(true);

    try {
        if (previousState === true) {
            // DELETE
            const response = await fetch(`${API_URL}/favorites/${propertyId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            // 204 No Content est un succès
            if (!response.ok && response.status !== 204) throw new Error("Erreur suppression");
        } else {
            // POST
            const response = await fetch(`${API_URL}/favorites/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ property_id: propertyId })
            });
            if (!response.ok && response.status !== 201) throw new Error("Erreur ajout");
        }
    } catch (error) {
        console.error("Erreur API Favoris:", error);
        setIsFavorite(previousState); // Rollback
        alert("Erreur lors de la mise à jour des favoris.");
    } finally {
        setFavLoading(false);
    }
  };

  
  useEffect(() => {
    const isMobileGallery = window.innerWidth < 768 && activeTab === 'Gallery';
    if (!property || property.images.length <= 1 || isPaused || isLightboxOpen) return;
    carouselTimerRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, 3000); 
    return () => { if (carouselTimerRef.current) clearInterval(carouselTimerRef.current); };
  }, [property, isPaused, isLightboxOpen, activeTab]);

  const handleBack = () => {
      if (activeTab === 'Gallery' && window.innerWidth < 768) { setActiveTab('About'); } else { onBack(); }
  };
  const nextImage = (e?: React.MouseEvent) => { e?.stopPropagation(); if (!property) return; setCurrentImageIndex((prev) => (prev + 1) % property.images.length); };
  const prevImage = (e?: React.MouseEvent) => { e?.stopPropagation(); if (!property) return; setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length); };
  const handleWhatsApp = () => { const msg = `Bonjour, je suis intéressé par : ${property?.title}`; window.open(`https://wa.me/237600000000?text=${encodeURIComponent(msg)}`, '_blank'); };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-900 w-10 h-10"/></div>;
  if (error || !property) return <div className="h-screen flex flex-col items-center justify-center"><AlertCircle className="text-red-500 w-12 h-12 mb-2"/><p>{error}</p><button onClick={onBack} className="mt-4 underline">Retour</button></div>;

  const isMobileGalleryMode = activeTab === 'Gallery';

  return (
    <div className={`min-h-screen relative animate-in fade-in ${isMobileGalleryMode ? 'bg-black h-screen overflow-hidden' : 'bg-white pb-24 md:pb-0'}`}>
      
      
      <div className={`${isMobileGalleryMode ? 'hidden md:block' : 'block'}`}>
        <div className="bg-gray-900 md:bg-white relative">
            
            <div 
                className="relative h-[45vh] md:h-[55vh] w-full md:max-w-6xl md:mx-auto md:rounded-b-3xl md:overflow-hidden z-0"
                onClick={() => setIsLightboxOpen(true)}
            >
                <img src={property.images[currentImageIndex]} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105 cursor-pointer"/>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 md:hidden pointer-events-none" />
            </div>

            
            <div className="absolute top-0 left-0 right-0 p-4 pt-12 md:pt-6 z-50 pointer-events-none md:max-w-6xl md:mx-auto">
                 <div className="flex justify-between px-5 md:px-12 w-full">
                    
                    <button 
                        onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation();
                            onBack(); 
                        }} 
                        className="pointer-events-auto bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/30 transition shadow-sm cursor-pointer active:scale-95"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    
                    <button 
                        onClick={handleToggleFavorite}
                        disabled={favLoading}
                        className={`
                            pointer-events-auto p-2.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer active:scale-90
                            ${isFavorite 
                                ? 'bg-blue-800 text-white hover:text-blue-900 hover:bg-gray-100' 
                                : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                            }
                        `}
                    >
                        <Heart 
                            size={20} 
                            className={`transition-transform duration-200 ${isFavorite ? 'fill-current scale-110' : 'scale-100'}`} 
                        />
                    </button>
                 </div>
            </div>

            {/* 3. FLÈCHES NAVIGATION (Desktop uniquement) */}
            {property.images.length > 1 && (
                <div className="absolute top-1/2 left-0 right-0 md:max-w-6xl md:mx-auto -translate-y-1/2 flex justify-between px-4 md:px-8 z-40 pointer-events-none hidden md:flex">
                    <button 
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="pointer-events-auto bg-black/30 text-white p-2 rounded-full hover:bg-black/50 cursor-pointer"
                    >
                        <ChevronLeft/>
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="pointer-events-auto bg-black/30 text-white p-2 rounded-full hover:bg-black/50 cursor-pointer"
                    >
                        <ChevronRight/>
                    </button>
                </div>
            )}
        </div>

        {/* Info Header */}
        <div className="relative -mt-6 md:mt-0 bg-white rounded-t-3xl md:rounded-none px-5 pt-8 md:max-w-6xl md:mx-auto md:px-8 md:py-10 z-10">
             <div className="mb-6">
                <div className="flex justify-between items-start">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{property.title}</h1>
                    <div className="flex flex-col items-end md:hidden">
                        <span className="text-blue-900 font-bold text-xl">{property.price} XAF</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                    <MapPin size={16} /><span>{property.address}</span>
                </div>
            </div>
        </div>
      </div>

      {/* ... RESTE DE L'INTERFACE ... */}
      <div className={`${isMobileGalleryMode ? 'absolute inset-0 z-50 flex flex-col' : 'md:max-w-6xl md:mx-auto md:px-8'}`}>
        <div className={`flex items-center justify-center gap-8 md:justify-start md:border-b md:border-gray-200 md:pb-1 md:mb-6 transition-all duration-300 ${isMobileGalleryMode ? 'absolute top-0 left-0 right-0 z-20 pt-12 pb-6 bg-gradient-to-b from-black/80 to-transparent text-white' : 'md:hidden pb-4 border-b border-gray-100 mb-6'}`}>
            {isMobileGalleryMode && ( <button onClick={handleBack} className="absolute left-5 top-12 p-2 bg-white/10 backdrop-blur-md rounded-full"><ArrowLeft size={20} className="text-white"/></button> )}
            {['About', 'Gallery', 'Review'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-sm font-bold relative transition-colors pb-1 ${isMobileGalleryMode ? (activeTab === tab ? 'text-white' : 'text-white/60') : (activeTab === tab ? 'text-blue-900' : 'text-gray-400')}`}>
                    {tab} {activeTab === tab && (<span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${isMobileGalleryMode ? 'bg-white' : 'bg-blue-900'}`}/>)}
                </button>
            ))}
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-12 h-full">
            <div className={`md:col-span-2 ${isMobileGalleryMode ? 'h-full w-full' : ''}`}>
                <div className={`${activeTab === 'About' ? 'block' : 'hidden'} md:block space-y-6 px-5 md:px-0 animate-in slide-in-from-bottom-2`}>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
                        <FeatureBadge icon={<BedDouble size={20}/>} label={`${property.features.beds} Chambres`} />
                        <FeatureBadge icon={<Bath size={20}/>} label={`${property.features.baths} Douches`} />
                        <FeatureBadge icon={<Utensils size={20}/>} label={`${property.features.kitchen} Cuisines`} />
                        <FeatureBadge icon={<Maximize size={20}/>} label={`${property.features.surface} m²`} />
                    </div>
                    <div><h3 className="font-bold text-lg text-gray-900 mb-3">Description</h3><p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{property.description}</p></div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3"><img src={property.owner.avatar} alt={property.owner.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" /><div><h4 className="font-bold text-sm text-gray-900">{property.owner.name}</h4><p className="text-xs text-gray-500">{property.owner.role}</p></div></div>
                        <div className="flex gap-2"><button onClick={handleWhatsApp} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"><MessageCircle size={20}/></button><button onClick={() => setShowContactModal(true)} className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"><MessageSquare size={20}/></button></div>
                    </div>
                    {property.coordinates && (<div><h3 className="font-bold text-lg text-gray-900 mb-3">Localisation</h3><div className="h-48 md:h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-sm"><PropertyMap lat={property.coordinates.lat} lng={property.coordinates.lng} address={property.address} /></div></div>)}
                </div>

                <div className={`${activeTab === 'Gallery' ? 'block' : 'hidden'} md:block md:mt-10 h-full`}>
                     <h3 className="font-bold text-lg text-gray-900 mb-3 hidden md:block">Galerie photos</h3>
                     <div className="md:hidden h-full w-full relative bg-black">
                        <img src={property.images[currentImageIndex]} alt="Gallery View" className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 flex z-10"><div className="w-1/3 h-full" onClick={prevImage} /><div className="w-1/3 h-full" onClick={() => setIsPaused(!isPaused)} /><div className="w-1/3 h-full" onClick={nextImage} /></div>
                        <div className="absolute bottom-8 left-4 right-4 z-20">
                            <div className="bg-white rounded-2xl p-3 shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
                                <img src={property.primaryImage} alt="Thumbnail" className="w-14 h-14 rounded-xl object-cover border border-gray-100"/>
                                <div className="flex-1 min-w-0"><h4 className="font-bold text-gray-900 truncate">{property.title}</h4><div className="flex items-center gap-1 text-gray-500 text-xs truncate mb-1"><MapPin size={12}/> {property.address}</div><div className="text-blue-900 font-bold text-sm">{property.price} XAF <span className="text-gray-400 font-normal text-xs">/mois</span></div></div>
                                <button onClick={() => setShowContactModal(true)} className="bg-blue-900 text-white p-3 rounded-full shadow-lg active:scale-95 transition"><MessageSquare size={18}/></button>
                            </div>
                            <div className="text-center mt-4"><span className="bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">{currentImageIndex + 1} / {property.images.length}</span></div>
                        </div>
                     </div>
                     <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                        {property.images.map((img, i) => (<div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer group relative" onClick={() => {setCurrentImageIndex(i); setIsLightboxOpen(true);}}><img src={img} className="w-full h-full object-cover group-hover:scale-110 transition duration-500"/><div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"/></div>))}
                     </div>
                </div>

                 <div className={`${activeTab === 'Review' ? 'block' : 'hidden'} md:block md:mt-12 md:pt-10 md:border-t md:border-gray-100 px-5 md:px-0`}>
                    <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-xl text-gray-900">Avis voyageurs</h3><div className="flex items-center gap-2"><Star className="text-yellow-500 fill-yellow-500" size={20}/> <span className="font-bold text-xl">{property.rating}</span><span className="text-gray-400 text-sm">({property.reviewCount} avis)</span></div></div>
                    <div className="grid gap-6 md:grid-cols-2">
                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">AL</div><div><p className="font-bold text-sm">Alice L.</p><p className="text-xs text-gray-400">Octobre 2023</p></div></div><p className="text-sm text-gray-600">Logement incroyable ! Exactement comme sur les photos.</p></div>
                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">MK</div><div><p className="font-bold text-sm">Marc K.</p><p className="text-xs text-gray-400">Septembre 2023</p></div></div><p className="text-sm text-gray-600">Très propre et bien situé. Je recommande vivement.</p></div>
                    </div>
                </div>
            </div>

            <div className="hidden md:block md:col-span-1">
                <div className="sticky top-24 bg-white border border-gray-200 shadow-xl rounded-2xl p-6">
                    <div className="flex justify-between items-end mb-6"><div><span className="text-gray-500 text-sm">Prix total</span><div className="text-3xl font-bold text-blue-900">{property.price} XAF</div></div><span className="text-gray-500 mb-1">/ mois</span></div>
                    <div className="space-y-3"><button onClick={() => setShowContactModal(true)} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">Contacter l'hôte</button><button onClick={handleWhatsApp} className="w-full bg-white border-2 border-green-500 text-green-600 py-3 rounded-xl font-bold hover:bg-green-50 transition flex items-center justify-center gap-2"><MessageCircle size={20}/> WhatsApp</button></div>
                </div>
            </div>
        </div>
      </div>
      
      {!isMobileGalleryMode && (<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:hidden z-30 pb-safe"><div className="flex items-center gap-4"><div className="flex-1"><p className="text-gray-400 text-xs">Prix total</p><p className="text-xl font-bold text-blue-900">{property.price}<span className="text-xs text-gray-500 font-normal">/mois</span></p></div><button onClick={() => setShowContactModal(true)} className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition">Réserver</button></div></div>)}
      {isLightboxOpen && (<div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200" onClick={() => setIsLightboxOpen(false)}><button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition z-50"><X size={32} /></button><div className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-10 flex items-center justify-center" onClick={(e) => e.stopPropagation()}><img src={property.images[currentImageIndex]} alt="Gallery" className="max-w-full max-h-full object-contain rounded-md shadow-2xl"/><button onClick={prevImage} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition"><ChevronLeft size={40}/></button><button onClick={nextImage} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition"><ChevronRight size={40}/></button></div></div>)}
      {showContactModal && (<div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"><div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-gray-900">Contacter l'agent</h3><button onClick={() => setShowContactModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={16}/></button></div><div className="space-y-3"><button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-3 p-4 bg-[#25D366]/10 text-[#25D366] rounded-xl font-bold border border-[#25D366]/20 hover:bg-[#25D366]/20 transition"><MessageCircle /> Discussion WhatsApp</button><button onClick={() => { setShowContactModal(false); onBookNow(); }} className="w-full flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-200 hover:bg-blue-100 transition"><MessageSquare /> Messagerie Interne</button></div></div></div>)}
    </div>
  );
}

// Badge Helper
const FeatureBadge = ({ icon, label }: { icon: React.ReactNode, label: string }) => (<div className="flex flex-col items-center justify-center gap-2 min-w-[80px] p-3 rounded-2xl border border-gray-100 bg-gray-50 md:bg-white"><div className="text-blue-900 bg-white p-2 rounded-full shadow-sm md:shadow-none md:bg-transparent md:p-0">{icon}</div><span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{label}</span></div>);
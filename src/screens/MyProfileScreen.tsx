import React, { useState, useEffect } from 'react';
import { 
  MapPin, Edit3, Home, Trash2, X, Save, Loader2, 
  PlusCircle, User, Search, Camera, Check, Lock, Phone, Shield
} from 'lucide-react';
import PriceMap from '../components/PriceMap';
import { useNavigate } from 'react-router-dom';
import CreateListingModal from '../components/Listing/CreateListingModal'; 


interface Property {
  id: number;
  title: string;
  monthly_rent: string;
  description: string;
  type: 'APARTMENT' | 'HOUSE' | 'ROOM'; // Ajouté
  surface: number;                        // Ajouté
  number_of_rooms: number;                // Ajouté
  number_of_bedrooms: number;             // Ajouté
  address: { full_address: string; lat: number; lng: number };
  primary_photo: { url: string } | null; 
}

// ... (Interface UserProfile inchangée) ...


interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  isLandlord: boolean; 
}

export default function MyProfileScreen() {
  // --- États UI ---

  const [loading, setLoading] = useState(true);
  
  // --- États Données ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userProperties, setUserProperties] = useState<Property[]>([]);

  // --- États Modals ---
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);

  // Formulaire Infos
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    location: '',
    is_landlord: false
  });

  // Formulaire Mot de passe
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });
  
  // Modal Édition ANNONCE EXISTANTE
  const [editPropertyForm, setEditPropertyForm] = useState({ 
    title: '', 
    monthly_rent: '', 
    description: '',
    type: 'APARTMENT',
    surface: '',
    number_of_rooms: '',
    number_of_bedrooms: ''
  });
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  //  1. CHARGEMENT DES DONNÉES 
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token'); 
      if (!token) { setLoading(false); return; }

      const headers = { 'Authorization': `Bearer ${token}` };

      // A. USER
      const userRes = await fetch('http://localhost:8000/api/auth/me/', { headers }); 
      
      if (userRes.ok) {
          const userData = await userRes.json();
          const isLandlord = userData.role === 'LANDLORD' || userData.is_landlord === true;
          
          const landlordCovers = [
             "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80", // Immeuble moderne
             "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", // Architecture business
             "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80", // Villa vue mer
             "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"  // Maison luxueuse
          ];

          const tenantCovers = [
             "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80", // Intérieur Cosy
             "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", // Appartement design
             "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", // Cuisine chaleureuse
             "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=1200&q=80"  // Salon chill
          ];

          const targetCollection = isLandlord ? landlordCovers : tenantCovers;
          const randomCover = targetCollection[Math.floor(Math.random() * targetCollection.length)];

          const userObj = {
              id: userData.id,
              first_name: userData.first_name || "",
              last_name: userData.last_name || "",
              email: userData.email || "",
              phone: userData.phone || "",
              role: isLandlord ? "Propriétaire" : "Locataire", 
              avatar: userData.profile_photo?.url || "", 
              coverImage: randomCover, 
              
              bio: userData.bio || "",
              location: userData.city || "",
              isLandlord: isLandlord
          };
          setUser(userObj);

          setProfileForm({
            first_name: userObj.first_name,
            last_name: userObj.last_name,
            phone: userObj.phone,
            bio: userObj.bio,
            location: userObj.location,
            is_landlord: isLandlord
          });

          // B. PROPRIÉTÉS
          if (isLandlord) {
              const propsRes = await fetch('http://localhost:8000/api/properties/my_properties/', { headers });
              if (propsRes.ok) {
                  const propsData = await propsRes.json();
                  const list = Array.isArray(propsData) ? propsData : (propsData.results || []);
                  setUserProperties(list);
              }
          }
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- API : MISE À JOUR INFOS ---
  const handleUpdateProfile = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('access_token');
    
    try {
        const response = await fetch('http://localhost:8000/api/auth/me/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                first_name: profileForm.first_name,
                last_name: profileForm.last_name,
                phone: profileForm.phone,
                bio: profileForm.bio,
                city: profileForm.location, 
                role: profileForm.is_landlord ? 'LANDLORD' : 'TENANT'
            })
        });

        if (response.ok) {
            await fetchData(); 
            setIsEditProfileOpen(false);
            alert("Profil mis à jour avec succès !");
        } else {
            alert("Erreur lors de la mise à jour des informations.");
        }
    } catch (error) {
        console.error("Erreur update profile:", error);
    } finally {
        setIsSaving(false);
    }
  };

  // --- API : CHANGEMENT MOT DE PASSE ---
const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
        alert("Les nouveaux mots de passe ne correspondent pas.");
        return;
    }
    if (!passwordForm.old_password || !passwordForm.new_password) {
        alert("Veuillez remplir tous les champs de mot de passe.");
        return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch('http://localhost:8000/api/auth/me/password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                old_password: passwordForm.old_password,
                new_password: passwordForm.new_password,
                new_password_confirm: passwordForm.new_password_confirm
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Mot de passe modifié avec succès.");
            setIsEditProfileOpen(false);
            setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' });
        } else {
            alert(data.detail || data.message || "Erreur lors du changement de mot de passe.");
        }
    } catch (error) {
        console.error("Erreur password:", error);
        alert("Erreur réseau.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (!window.confirm("Supprimer cette annonce ?")) return;
    const token = localStorage.getItem('access_token');
    try {
        await fetch(`http://localhost:8000/api/properties/${id}/`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
        });
        setUserProperties(prev => prev.filter(p => p.id !== id));
    } catch(e) { console.error(e); }
  };

  const handleUpdateProperty = async () => {
    if (!editingProperty) return;
    setIsSaving(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`http://localhost:8000/api/properties/${editingProperty.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editPropertyForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setUserProperties(prev => prev.map(p => p.id === editingProperty.id ? updated : p));
        setEditingProperty(null);
      }
    } catch(e) { console.error(e); }
    finally { setIsSaving(false); }
  };


  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-900 w-10 h-10"/></div>;
  }

  return (
    <div className="min-h-screen animate-in slide-in-from-right-10 bg-gray-50 pb-24 relative">
      
      {/* HEADER PROFIL */}
      <div className="bg-white shadow-sm pb-4">
        {/* ... (Code Header inchangé) ... */}
        <div className="h-48 md:h-64 w-full relative bg-gray-800 overflow-hidden">
          <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 mb-6 gap-6">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center bg-gray-100">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={60} className="text-gray-400" />}
              </div>
            </div>
            <div className="flex-1 mt-2 md:mt-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.first_name} {user.last_name}</h1>
                  <p className="text-gray-600 font-medium flex items-center gap-2">
                    {user.role}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.isLandlord ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.isLandlord ? 'Hôte' : 'Locataire'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { setIsEditProfileOpen(true); setActiveTab('info'); }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition">
                        <Edit3 size={18} /><span>Modifier Profil</span>
                    </button>
                </div>
              </div>
            </div>
          </div>
          {user.isLandlord && (
            <div className="flex border-t border-gray-100 pt-4 gap-8">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-gray-900">{userProperties.length}</span>
                    <span className="text-gray-500 text-sm">Annonces</span>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.isLandlord ? (
            /* VUE LANDLORD */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Home size={20} /> Mes Propriétés</h3>
                        
                        {/* --- BOUTON AJOUTER PROPRIÉTÉ --- */}
                        <button 
                            onClick={() => setIsCreateListingOpen(true)}
                            className="text-sm font-bold bg-blue-900 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-800 transition shadow-lg"
                        >
                            <PlusCircle size={16}/> Créer une annonce
                        </button>
                    </div>

                    <div className="space-y-4">
                        {userProperties.length === 0 && (
                            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">Vous n'avez pas encore d'annonces.</p>
                            </div>
                        )}
                        {userProperties.map((prop) => (
                          <div key={prop.id} 
                            onClick={() => navigate(`/property/${prop.id}/`)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col sm:flex-row gap-4 cursor-pointer"
                          >
                            <div className="w-full sm:w-40 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={prop.primary_photo?.url || '/placeholder-house.jpg'} className="w-full h-full object-cover" alt={prop.title} />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                  <div className="flex justify-between items-start">
                                      <h4 className="font-bold text-gray-900 line-clamp-1 text-lg">{prop.title}</h4>
                                      <div className="text-blue-900 font-bold whitespace-nowrap">{parseInt(prop.monthly_rent).toLocaleString('fr-FR')} XAF</div>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2 mt-1 flex items-center gap-1"><MapPin size={12}/> {prop.address?.full_address}</p>
                              </div>
                              
                              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
                                  
                                 {/* BOUTON MODIFIER */}
                                  <button 
                                      onClick={(e) => { 
                                          e.stopPropagation();
                                          setEditingProperty(prop); 
                                          setEditPropertyForm({ 
                                              title: prop.title || '', 
                                              monthly_rent: prop.monthly_rent ? prop.monthly_rent.toString() : '', 
                                              description: prop.description || 'Aucune description fournie.',
                                              type: (prop.type as any) || 'APARTMENT',
                                              surface: (prop.surface !== null && prop.surface !== undefined) ? prop.surface.toString() : '',
                                              number_of_rooms: (prop.number_of_rooms !== null && prop.number_of_rooms !== undefined) ? prop.number_of_rooms.toString() : '',
                                              number_of_bedrooms: (prop.number_of_bedrooms !== null && prop.number_of_bedrooms !== undefined) ? prop.number_of_bedrooms.toString() : ''
                                          });
                                      }} 
                                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition"
                                  >
                                      <Edit3 size={14} /> Modifier
                                  </button>
                                  
                                  <button 
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteProperty(prop.id);
                                      }} 
                                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition"
                                  >
                                      <Trash2 size={14} /> Supprimer
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[500px]">
                        <PriceMap properties={userProperties} activeId={null} onMarkerClick={() => {}} />
                    </div>
                </div>
            </div>
        ) : (
            /* VUE TENANT */
            <div className="max-w-3xl mx-auto space-y-6">
               <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                    <h2 className="text-2xl font-bold">Bonjour {user.first_name}</h2>
                    <p className="mb-4">Espace locataire</p>
                    <button 
                        onClick={() => { setProfileForm({...profileForm, is_landlord: true}); setActiveTab('info'); setIsEditProfileOpen(true); }}
                        className="px-4 py-2 bg-blue-900 text-white rounded-lg"
                    >
                        Devenir Hôte
                    </button>
               </div>
            </div>
        )}
      </div>

      {/* --- MODAL EDIT PROFIL --- */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl my-8">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-xl text-gray-900">Modifier mon profil</h3>
                   <button onClick={()=>setIsEditProfileOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
               </div>

               {/* Onglets */}
               <div className="flex gap-6 mb-6 border-b border-gray-200">
                   <button onClick={() => setActiveTab('info')} className={`pb-3 text-sm font-medium transition relative ${activeTab === 'info' ? 'text-blue-900' : 'text-gray-500'}`}>
                       Informations personnelles
                       {activeTab === 'info' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-900"></span>}
                   </button>
                   <button onClick={() => setActiveTab('security')} className={`pb-3 text-sm font-medium transition relative ${activeTab === 'security' ? 'text-blue-900' : 'text-gray-500'}`}>
                       Sécurité & Mot de passe
                       {activeTab === 'security' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-900"></span>}
                   </button>
               </div>

               {activeTab === 'info' ? (
                   <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-gray-500 mb-1">Prénom</label>
                               <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 outline-none" value={profileForm.first_name} onChange={e=>setProfileForm({...profileForm, first_name:e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-gray-500 mb-1">Nom</label>
                               <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 outline-none" value={profileForm.last_name} onChange={e=>setProfileForm({...profileForm, last_name:e.target.value})} />
                           </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-gray-500 mb-1">Téléphone</label>
                               <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 outline-none" value={profileForm.phone} onChange={e=>setProfileForm({...profileForm, phone:e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-gray-500 mb-1">Ville / Quartier</label>
                               <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 outline-none" value={profileForm.location} onChange={e=>setProfileForm({...profileForm, location:e.target.value})} />
                           </div>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Bio / À propos</label>
                           <textarea rows={3} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 outline-none resize-none" value={profileForm.bio} onChange={e=>setProfileForm({...profileForm, bio:e.target.value})} placeholder="Parlez un peu de vous..." />
                       </div>

                       <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                           <input type="checkbox" id="isLandlord" className="w-4 h-4 text-blue-900 rounded" checked={profileForm.is_landlord} onChange={()=>setProfileForm({...profileForm, is_landlord: !profileForm.is_landlord})} /> 
                           <label htmlFor="isLandlord" className="text-sm font-medium text-gray-700 cursor-pointer">Je souhaite publier des annonces (Compte Hôte)</label>
                       </div>

                       <button onClick={handleUpdateProfile} disabled={isSaving} className="mt-2 w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition disabled:opacity-50">
                           {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                       </button>
                   </div>
               ) : (
                   <div className="space-y-4">
                       <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Ancien mot de passe</label>
                           <input className="w-full border border-gray-300 rounded-lg p-2.5" type="password" value={passwordForm.old_password} onChange={e=>setPasswordForm({...passwordForm, old_password:e.target.value})} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Nouveau MDP</label>
                                <input className="w-full border border-gray-300 rounded-lg p-2.5" type="password" value={passwordForm.new_password} onChange={e=>setPasswordForm({...passwordForm, new_password:e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Confirmer</label>
                                <input className="w-full border border-gray-300 rounded-lg p-2.5" type="password" value={passwordForm.new_password_confirm} onChange={e=>setPasswordForm({...passwordForm, new_password_confirm:e.target.value})} />
                            </div>
                       </div>
                       <button onClick={handleChangePassword} disabled={isSaving} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold shadow-lg transition disabled:opacity-50">
                           {isSaving ? 'Traitement...' : 'Mettre à jour le mot de passe'}
                       </button>
                   </div>
               )}
           </div>
        </div>
      )}

      {/* --- NOUVEAU MODAL : CRÉER ANNONCE --- */}
      {isCreateListingOpen && (
        <CreateListingModal 
            onClose={() => setIsCreateListingOpen(false)}
            onSuccess={() => {
                // Recharger les données après création réussie
                fetchData();
            }}
        />
      )}

      {/* --- MODAL EDIT PROPERTY (Existant) --- */}
      {/* --- MODAL EDIT PROPERTY COMPLET --- */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
             <div className="bg-white p-6 rounded-xl w-full max-w-2xl my-8 shadow-2xl relative">
                 <button onClick={()=>setEditingProperty(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                 
                 <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                     <Edit3 size={20} className="text-blue-900"/> Modifier l'annonce
                 </h3>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne Gauche */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Titre de l'annonce</label>
                            <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 outline-none" value={editPropertyForm.title} onChange={e=>setEditPropertyForm({...editPropertyForm, title:e.target.value})} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Loyer (Mensuel)</label>
                                <div className="relative">
                                    <input type="number" className="w-full border border-gray-300 rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-blue-100 outline-none" value={editPropertyForm.monthly_rent} onChange={e=>setEditPropertyForm({...editPropertyForm, monthly_rent:e.target.value})} />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-xs font-bold">XAF</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Type de bien</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={editPropertyForm.type}
                                    onChange={(e) => setEditPropertyForm({...editPropertyForm, type: e.target.value as any})}
                                >
                                    <option value="APARTMENT">Appartement</option>
                                    <option value="HOUSE">Maison</option>
                                    <option value="ROOM">Chambre</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Surface</label>
                                <input type="number" placeholder="m²" className="w-full border border-gray-300 rounded-lg p-2.5" value={editPropertyForm.surface} onChange={e=>setEditPropertyForm({...editPropertyForm, surface:e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Pièces</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg p-2.5" value={editPropertyForm.number_of_rooms} onChange={e=>setEditPropertyForm({...editPropertyForm, number_of_rooms:e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Chambres</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg p-2.5" value={editPropertyForm.number_of_bedrooms} onChange={e=>setEditPropertyForm({...editPropertyForm, number_of_bedrooms:e.target.value})} />
                            </div>
                        </div>
                    </div>

                    {/* Colonne Droite */}
                    <div className="space-y-4">
                        <div className="h-full flex flex-col">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Description détaillée</label>
                            <textarea 
                                className="flex-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-100 outline-none resize-none" 
                                value={editPropertyForm.description} 
                                onChange={e=>setEditPropertyForm({...editPropertyForm, description:e.target.value})} 
                                placeholder="Décrivez les atouts de votre bien..."
                                style={{ minHeight: '180px' }}
                            />
                        </div>
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                     <button onClick={()=>setEditingProperty(null)} className="px-6 py-2.5 text-gray-700 font-bold hover:bg-gray-100 rounded-lg transition">Annuler</button>
                     <button onClick={handleUpdateProperty} disabled={isSaving} className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition flex items-center gap-2">
                        {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                        Enregistrer
                     </button>
                 </div>
             </div>
        </div>
      )}

    </div>
  );
}
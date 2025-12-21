import React from 'react';
import { X, Map, LayoutList, Settings, Heart, MessageSquare, LogOut, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface RightNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;
}

export default function RightNavbar({ isOpen, onClose, viewMode, setViewMode }: RightNavbarProps) {
  
  const navigate = useNavigate();
  const handleModeSwitch = (mode: 'list' | 'map') => {
    setViewMode(mode);
    onClose();
  };

  const handleLogout = () => {
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    onClose();

    
    navigate('/signin');
  };

  return (
    <>
      
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={onClose}
      />

    
      <div className={`fixed top-0 right-0 h-full w-[280px] md:w-[350px] bg-white z-[2001] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Affichage</p>
            <div className="bg-gray-100 p-1 rounded-xl flex">
               <button 
                 onClick={() => handleModeSwitch('list')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <LayoutList size={18} /> Liste
               </button>
               <button 
                 onClick={() => handleModeSwitch('map')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <Map size={18} /> Carte
               </button>
            </div>
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Mon Compte</p>
          <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"><MessageSquare size={20} /> Messages</button>
          <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"><Settings size={20} /> Paramètres</button>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition">
            <LogOut size={20} /> Se déconnecter
          </button>
        </div>

      </div>
    </>
  );
}
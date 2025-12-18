import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHouse, FaMessage } from "react-icons/fa6";
import { Bell, Menu, X, User, LogOut, Settings, Heart, LayoutDashboard } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]); 

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      setIsLoggedIn(false);
      navigate("/");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* --- NAVBAR FIXE --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 px-4 md:px-8 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 transition-all">
        <Link to='/' className="flex items-center gap-2 group z-50">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition">
             <FaHouse className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">RentHub</p>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-gray-500 font-medium text-sm lg:text-base">
          <Link to="/" className="hover:text-blue-600 transition cursor-pointer">Explorer</Link>
          <Link to="/favorites" className="hover:text-blue-600 transition cursor-pointer">Favoris</Link>
          <li className="hover:text-blue-600 transition cursor-pointer">Logements</li>
          <li className="hover:text-blue-600 transition cursor-pointer">Expériences</li>
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/messages" className="hidden md:block text-gray-500 hover:text-blue-600 transition p-2 hover:bg-gray-100 rounded-full">
            <FaMessage className="w-5 h-5"/> 
          </Link>

          <button className="hidden md:block text-gray-500 hover:text-blue-600 transition p-2 hover:bg-gray-100 rounded-full relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* BOUTON MENU BURGER */}
          <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 border border-gray-200 rounded-full p-1 pl-3 hover:shadow-md transition ml-2"
          >
            <Menu className="w-5 h-5 text-gray-600" />
            <div className="bg-gray-500 w-8 h-8 rounded-full flex items-center justify-center text-white overflow-hidden">
                <User className="w-5 h-5" /> 
            </div>
          </button>
        </div>
      </nav>

      {/* --- SIDEBAR / DRAWER --- */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Menu</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
                <X className="w-6 h-6 text-gray-500" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
            {isLoggedIn ? (
                <div className="flex flex-col space-y-1 px-3">
                    <Link to="/account" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition font-medium">
                        <User size={20} /> Mon Profil
                    </Link>
                    <Link to="/profileproperties" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition font-medium">
                        <LayoutDashboard size={20} /> Mes Propriétés
                    </Link>
                    {/* Liens Mobile Only */}
                    <Link to="/messages" className="flex md:hidden items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition font-medium">
                        <FaMessage size={18} /> Messagerie
                    </Link>
                    <Link to="/account/favorites" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition font-medium">
                        <Heart size={20} /> Favoris
                    </Link>
                    <div className="h-px bg-gray-100 my-2 mx-4"></div>
                    <Link to="/help" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition text-sm">
                        Aide & Support
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col space-y-4 px-5">
                    <p className="text-sm text-gray-500 text-center">Connectez-vous pour gérer vos locations.</p>
                    <Link to="/login" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-center hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                        Se connecter
                    </Link>
                    <Link to="/register" className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-xl text-center hover:bg-gray-200 transition">
                        S'inscrire
                    </Link>
                </div>
            )}
        </div>

        {isLoggedIn && (
            <div className="p-4 border-t border-gray-100">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 py-3 rounded-xl font-medium transition">
                    <LogOut size={20} /> Déconnexion
                </button>
            </div>
        )}
      </div>
    </>
  );
}

export default Navbar;

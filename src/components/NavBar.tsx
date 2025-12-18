import React, { useState } from "react";
import { 
  Menu, X, Map, Settings, Heart, MessageSquare, 
  HelpCircle, LogOut, User, Bell 
} from "lucide-react";
import { FaHouse } from "react-icons/fa6";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: Map, label: "Explore Map", link: "#map" },
    { icon: Heart, label: "Saved Homes", link: "#saved" },
    { icon: MessageSquare, label: "Messages", link: "#messages", badge: 2 },
    { icon: Settings, label: "Settings", link: "#settings" },
    { icon: HelpCircle, label: "Help Center", link: "#help" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          
          {/* LOGO */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-lg">
               <FaHouse size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Rent<span className="text-blue-600">Hub</span>
            </span>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="font-medium text-gray-600 hover:text-blue-600 transition">Stays</a>
            <a href="#" className="font-medium text-gray-600 hover:text-blue-600 transition">Experiences</a>
            <a href="#" className="font-medium text-gray-600 hover:text-blue-600 transition">Host</a>
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 border border-gray-300 rounded-full py-1 px-3 hover:shadow-md transition">
              <Menu size={18} />
              <div className="bg-gray-500 rounded-full p-1 text-white">
                <User size={16} />
              </div>
            </button>
          </div>

          {/* MOBILE BURGER BUTTON */}
          <button 
            className="md:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-lg transition"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* MOBILE SIDEBAR (Drawer) */}
      <div 
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay sombre */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Le panneau glissant */}
        <div 
          className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header du menu */}
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <span className="text-xl font-bold text-gray-900">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Liens Outils */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item, idx) => (
              <a 
                key={idx} 
                href={item.link}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
              >
                <item.icon size={22} className="group-hover:text-blue-600 text-gray-400" />
                <span className="font-medium text-lg">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Footer du menu */}
          <div className="p-6 border-t border-gray-100">
             <button className="flex items-center gap-3 text-red-500 font-medium w-full p-2 hover:bg-red-50 rounded-lg transition">
                <LogOut size={20} /> Log out
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

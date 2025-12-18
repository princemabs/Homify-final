import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { FaHouse } from "react-icons/fa6";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Grille responsive : 1 col (mobile) -> 2 cols (tablette) -> 4 cols (desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Colonne Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                 <FaHouse size={18} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Rent<span className="text-blue-500">Hub</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your trusted platform for finding the perfect accommodation anywhere in the world. Safe, fast, and reliable.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white text-gray-400 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              {["About us", "Careers", "Press", "Blog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {["Help center", "Contact us", "Trust & Safety", "Cancellation options"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Legal</h3>
            <ul className="space-y-3">
              {["Privacy policy", "Terms of service", "Cookie policy", "Accessibility"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} RentHub Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
             <span className="text-gray-600 text-sm cursor-pointer hover:text-gray-400">English (US)</span>
             <span className="text-gray-600 text-sm cursor-pointer hover:text-gray-400">$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

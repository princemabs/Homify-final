import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react"; 

function HeroSection() {
  const [where, setWhere] = useState("");
  const [rent, setRent] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (where) params.append("where", where);
    if (rent) params.append("rent", rent);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section
      className="relative bg-cover bg-center min-h-[85vh] md:min-h-[70vh] flex flex-col justify-center items-center text-white px-4 pt-20 md:pt-0"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80"></div>

      <div className="relative text-center z-10 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Find Your Perfect Stay
        </h1>
        <p className="text-base md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Discover amazing places to stay, from cozy homes to luxury hotels, all in one place.
        </p>

        {/* --- BARRE DE RECHERCHE RESPONSIVE --- */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-2 w-full flex flex-col md:flex-row gap-4 md:gap-2 items-center">
          
          <div className="flex-1 w-full md:w-auto flex flex-col items-start px-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={where}
              onChange={e => setWhere(e.target.value)}
              className="w-full text-gray-900 font-medium placeholder-gray-400 focus:outline-none bg-transparent"
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200"></div>

          <div className="flex-1 w-full md:w-auto flex flex-col items-start px-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Max Rent</label>
            <input
              type="number"
              placeholder="Add amount"
              value={rent}
              onChange={e => setRent(e.target.value)}
              className="w-full text-gray-900 font-medium placeholder-gray-400 focus:outline-none bg-transparent"
            />
          </div>

          <button
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white p-4 md:px-8 md:py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" />
            <span className="font-bold text-lg md:hidden">Search</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

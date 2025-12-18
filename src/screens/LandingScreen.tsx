import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, ArrowRight, Star, CheckCircle, 
  MapPin, Bed, Bath, Users, ChevronDown, 
  Heart, Shield, Clock, Home 
} from "lucide-react";

// Importe tes composants existants (ou utilise ceux définis plus bas si tu préfères tout dans un fichier)
//import Navbar from "../components/Navbar"; 
//import { Footer } from "../components/Footer";

// --- DONNÉES STATIQUES (Pour simplifier l'affichage) ---
const PROPERTIES = [
  {
    id: 1,
    title: "Luxury Villa Oceanview",
    location: "Beverly Hills, CA",
    price: "$4,500",
    rating: 4.9,
    beds: 5,
    baths: 4,
    guests: 8,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    tag: "Popular"
  },
  {
    id: 2,
    title: "Modern Loft Downtown",
    location: "New York City, NY",
    price: "$3,200",
    rating: 4.8,
    beds: 2,
    baths: 2,
    guests: 4,
    image: "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?auto=format&fit=crop&w=800&q=80",
    tag: "New"
  },
  {
    id: 3,
    title: "Cozy Mountain Cabin",
    location: "Aspen, CO",
    price: "$2,100",
    rating: 4.95,
    beds: 3,
    baths: 2,
    guests: 6,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    tag: "Superhost"
  },
];

const COLLECTIONS = [
  { title: "Serviced Apartments", count: "120+ stays", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80" },
  { title: "Work & Travel", count: "85+ stays", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" },
  { title: "Family Vacations", count: "200+ stays", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80" },
  { title: "Pet Friendly", count: "60+ stays", image: "https://images.unsplash.com/photo-1541604193-471019d12a85?auto=format&fit=crop&w=600&q=80" },
];

const FAQS = [
  { q: "How does the booking process work?", a: "Search for your location, choose your dates, and book instantly. We hold the payment until you check in safely." },
  { q: "Is there a cancellation policy?", a: "Yes, hosts set their own policies (Flexible, Moderate, or Strict). This is clearly displayed on every listing page." },
  { q: "Are the properties verified?", a: "Absolutely. We manually verify every listing and host identity to ensure your safety and match the photos." },
  { q: "Can I schedule a visit?", a: "For long-term rentals (1 month+), we offer virtual tours and in-person visits upon request." },
];

// --- COMPOSANT PRINCIPAL ---
export default function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  
  // États de recherche
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?where=${where}`);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      {/*<Navbar />*/}

      {/* ================= HERO SECTION ================= */}
      {/* pt-20 compense la navbar fixe */}
      <section className="relative pt-20 lg:pt-0">
        <div className="relative h-[600px] lg:h-[750px] w-full overflow-hidden">
          {/* Image de fond */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-e32c19e31669?auto=format&fit=crop&w=1920&q=80')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
          </div>

          {/* Contenu Hero */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto mt-[-40px]">
            <span className="bg-blue-600/90 text-white px-4 py-1 rounded-full text-sm font-semibold mb-6 tracking-wide backdrop-blur-sm">
              No. 1 Rental Platform
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Find your place <br/> to call <span className="text-blue-400">home.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl drop-shadow-md">
              Discover verified homes, apartments, and luxury stays. 
              Seamless booking, secure payments, and 24/7 support.
            </p>

            {/* Barre de Recherche Flottante */}
            <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                <input 
                  type="text" 
                  placeholder="Where are you going?" 
                  className="w-full outline-none text-gray-900 font-medium placeholder-gray-400"
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                />
              </div>
              <div className="flex-1 px-4 py-2 flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                <input 
                  type="date" 
                  className="w-full outline-none text-gray-900 font-medium bg-transparent placeholder-gray-400"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 md:py-0 font-bold text-lg transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                <Search size={20} /> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= TRUST & STATS (Transition) ================= */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap justify-center md:justify-between items-center gap-8 text-gray-400 grayscale opacity-70">
           {/* Logos factices pour l'effet "Trust" */}
           <span className="text-xl font-bold flex items-center gap-2"><Shield /> SecurePay</span>
           <span className="text-xl font-bold flex items-center gap-2"><Star /> TrustPilot</span>
           <span className="text-xl font-bold flex items-center gap-2"><Home /> BestStay</span>
           <span className="text-xl font-bold flex items-center gap-2"><Users /> Community</span>
        </div>
      </section>

      {/* ================= COLLECTIONS ================= */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Collection</h2>
              <p className="text-gray-500">Curated categories for every lifestyle</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-1 text-blue-600 font-semibold hover:gap-2 transition-all">
              View all <ArrowRight size={18}/>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((item, idx) => (
              <div key={idx} className="group cursor-pointer relative overflow-hidden rounded-2xl h-80 shadow-sm hover:shadow-xl transition-all">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-300 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md w-fit">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PROPERTIES ================= */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Hand-picked selections of the best rated stays in your favorite destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROPERTIES.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                {/* Image Header */}
                <div className="relative h-64 overflow-hidden">
                  <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-800">
                    {property.tag}
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white text-white hover:text-red-500 transition">
                    <Heart size={18} />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur text-white px-3 py-1 rounded-lg font-bold">
                    {property.price}<span className="text-xs font-normal">/mo</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{property.title}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" /> {property.rating}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                    <MapPin size={14} /> {property.location}
                  </p>
                  
                  <div className="flex items-center justify-between text-gray-400 text-sm border-t border-gray-100 pt-4 mt-4">
                    <span className="flex items-center gap-2"><Bed size={16} /> {property.beds} Beds</span>
                    <span className="flex items-center gap-2"><Bath size={16} /> {property.baths} Baths</span>
                    <span className="flex items-center gap-2"><Users size={16} /> {property.guests} Guests</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-xl hover:border-blue-600 hover:text-blue-600 transition">
              View All Properties
            </button>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITION (Discover) ================= */}
      <section className="py-20 px-4 md:px-8 bg-blue-900 text-white overflow-hidden relative">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <h2 className="text-blue-400 font-bold tracking-wide uppercase text-sm mb-2">Why Choose RentHub?</h2>
             <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
               Seamless renting, <br/> from start to finish.
             </h3>
             <p className="text-blue-100 text-lg mb-8 leading-relaxed">
               We re-engineered the rental process to be transparent, digital, and secure. No more paperwork, no more hidden fees.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-xl bg-blue-800 flex items-center justify-center flex-shrink-0 text-blue-300"><Shield size={24}/></div>
                   <div><h4 className="font-bold text-lg">Secure Payments</h4><p className="text-blue-200 text-sm">Money held safely until check-in.</p></div>
                </div>
                <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-xl bg-blue-800 flex items-center justify-center flex-shrink-0 text-blue-300"><CheckCircle size={24}/></div>
                   <div><h4 className="font-bold text-lg">Verified Listings</h4><p className="text-blue-200 text-sm">Every home is manually checked.</p></div>
                </div>
                <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-xl bg-blue-800 flex items-center justify-center flex-shrink-0 text-blue-300"><Clock size={24}/></div>
                   <div><h4 className="font-bold text-lg">Instant Booking</h4><p className="text-blue-200 text-sm">No waiting for approvals.</p></div>
                </div>
             </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="relative bg-white p-2 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
               <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80" alt="App Preview" className="rounded-2xl w-full" />
               <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full"><CheckCircle size={24} /></div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Status</p>
                    <p className="font-bold text-gray-900">Apartment Booked!</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Got Questions?</h2>
            <p className="text-gray-500 mt-2">We have answers.</p>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className={`font-bold text-lg ${activeFaq === index ? "text-blue-600" : "text-gray-800"}`}>{item.q}</span>
                  <ChevronDown className={`transition-transform duration-300 ${activeFaq === index ? "rotate-180 text-blue-600" : "text-gray-400"}`} />
                </button>
                <div className={`px-6 text-gray-600 transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === index ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 bg-white text-center">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to find your dream stay?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of happy renters and hosts on RentHub today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="bg-white text-blue-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition shadow-lg">Get Started</button>
            <button className="bg-blue-800 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-900 transition border border-blue-500">Become a Host</button>
          </div>
        </div>
      </section>

      {/*<Footer />*/}
    </div>
  );
}

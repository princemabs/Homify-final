import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, ArrowRight, Star, CheckCircle, 
  MapPin, Bed, Bath, Users, ChevronDown, 
  Heart, Shield, Clock, Home, Zap, Menu 
} from "lucide-react";

const PROPERTIES = [
  {
    id: 1,
    title: "Penthouse de Luxe Bastos",
    location: "Bastos, Yaoundé",
    price: "150,000 FCFA",
    rating: 4.96,
    beds: 3,
    baths: 2,
    guests: 6,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Coup de Cœur"
  },
  {
    id: 2,
    title: "Loft Industriel chic",
    location: "Bonapriso, Douala",
    price: "95,000 FCFA",
    rating: 4.85,
    beds: 1,
    baths: 1,
    guests: 2,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Nouveau"
  },
  {
    id: 3,
    title: "Villa Bord de Mer",
    location: "Kribi, Sud",
    price: "200,000 FCFA",
    rating: 5.0,
    beds: 4,
    baths: 3,
    guests: 8,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Superhost"
  },
];

const COLLECTIONS = [
  { title: "Escapades Romantiques", count: "120+ logements", image: "https://images.unsplash.com/photo-1512918760532-3ed6400d5b97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
  { title: "Télétravail & Business", count: "85+ logements", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
  { title: "Vacances en Famille", count: "200+ logements", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
  { title: "Animaux Bienvenus", count: "60+ logements", image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
];

const FAQS = [
  { q: "Comment fonctionne la réservation ?", a: "Recherchez votre logement idéal, choisissez vos dates et réservez instantanément ou envoyez une demande. Votre paiement est sécurisé jusqu'à l'arrivée." },
  { q: "Puis-je annuler ma réservation ?", a: "Oui, selon la politique choisie par l'hôte (Flexible, Modérée ou Stricte). Tout est clairement affiché avant de payer." },
  { q: "Les logements sont-ils vérifiés ?", a: "Absolument. Chaque annonce passe par un processus de vérification manuelle pour garantir la conformité avec les photos." },
  { q: "Proposez-vous des visites ?", a: "Pour les locations longue durée (1 mois+), nous organisons des visites physiques ou virtuelles sur demande." },
];
export default function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties?where=${where}`);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-white selection:bg-blue-100 selection:text-blue-900">
      
      <section className="relative w-full overflow-hidden">
        <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-6">
            
            {/* Logo à Gauche */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                    <Home size={24} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight drop-shadow-md">Homifi</span>
            </div>

            {/* Boutons à Droite */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/signin')}
                    className="hidden md:block text-white font-semibold hover:text-blue-200 transition px-4 py-2"
                >
                    Se connecter
                </button>

                <button 
                    onClick={() => navigate('/signup')}
                    className="bg-white text-blue-900 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition shadow-lg hover:scale-105 active:scale-95"
                >
                    S'inscrire
                </button>
            </div>
        </nav>


        <div className="relative h-[700px] lg:h-[850px] w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-e32c19e31669?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-6xl mx-auto pt-20">
            
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 tracking-wide shadow-lg">
                <Star size={14} className="text-yellow-400 fill-yellow-400" /> N°1 de la location au Cameroun
              </span>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl tracking-tight">
                Trouvez l'endroit idéal <br/> pour vous sentir <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">chez vous.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md font-medium">
                Découvrez des appartements vérifiés, des villas de luxe et des séjours uniques. 
                Réservation simple, paiement sécurisé et support 24/7.
              </p>
            </div>

              <form 
                onSubmit={handleSearch} 
                className="animate-fade-in-up delay-100 bg-white p-2 rounded-2xl md:rounded-full shadow-2xl w-full max-w-4xl flex flex-col md:flex-row gap-2 items-center transform transition-all hover:scale-[1.01]"
              >
                
                <div className="relative group flex-1 w-full flex flex-col items-start px-4 py-3 md:px-6 md:py-3 border-b border-gray-100 md:border-b-0 md:border-r">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-blue-600">
                    <MapPin size={12} className="md:hidden" /> Destination
                  </label>
                  <input 
                    type="text" 
                    placeholder="Où allez-vous ?" 
                    className="w-full outline-none text-gray-900 font-bold placeholder-gray-400 text-base truncate bg-transparent"
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                  />
                </div>

                <div className="relative group flex-1 w-full flex flex-col items-start px-4 py-3 md:px-6 md:py-3 border-b border-gray-100 md:border-b-0">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-blue-600">
                    <Clock size={12} className="md:hidden" /> Arrivée
                  </label>
                  <input 
                    type="date" 
                    className="w-full outline-none text-gray-900 font-bold bg-transparent text-base placeholder-gray-400 font-sans"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-full px-8 py-4 md:py-3 font-bold text-lg transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2"
                >
                  <Search size={20} strokeWidth={2.5} /> 
                  <span className="md:hidden">Rechercher</span>
                </button>
                
              </form>

          </div>
        </div>
      </section>

      {/* ================= TRUST & STATS ================= */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap justify-center md:justify-around items-center gap-8 md:gap-12">
           <div className="flex items-center gap-3 text-gray-400 grayscale hover:grayscale-0 transition duration-300 opacity-70 hover:opacity-100 cursor-default">
             <Shield size={28} /> <span className="text-lg font-bold">Paiement Sécurisé</span>
           </div>
           <div className="flex items-center gap-3 text-gray-400 grayscale hover:grayscale-0 transition duration-300 opacity-70 hover:opacity-100 cursor-default">
             <Star size={28} /> <span className="text-lg font-bold">4.9/5 Avis</span>
           </div>
           <div className="flex items-center gap-3 text-gray-400 grayscale hover:grayscale-0 transition duration-300 opacity-70 hover:opacity-100 cursor-default">
             <Home size={28} /> <span className="text-lg font-bold">10k+ Logements</span>
           </div>
           <div className="flex items-center gap-3 text-gray-400 grayscale hover:grayscale-0 transition duration-300 opacity-70 hover:opacity-100 cursor-default">
             <Users size={28} /> <span className="text-lg font-bold">Support 24/7</span>
           </div>
        </div>
      </section>

      {/* ================= COLLECTIONS ================= */}
      <section className="py-20 px-4 md:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Explorez par Collection</h2>
              <p className="text-gray-500 text-lg">Des catégories pensées pour tous les styles de vie.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all px-4 py-2 hover:bg-blue-50 rounded-lg">
              Tout voir <ArrowRight size={20}/>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((item, idx) => (
              <div key={idx} className="group cursor-pointer relative overflow-hidden rounded-3xl h-80 shadow-sm hover:shadow-2xl transition-all duration-500">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <h3 className="text-xl font-bold mb-2 transform translate-y-0 group-hover:-translate-y-1 transition duration-300">{item.title}</h3>
                  <div className="flex items-center justify-between">
                     <p className="text-sm text-gray-200 font-medium">{item.count}</p>
                     <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                        <ArrowRight size={14} />
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PROPERTIES ================= */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Coup de Cœur</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Logements à la Une</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Une sélection triée sur le volet des lieux les mieux notés par notre communauté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROPERTIES.map((property) => (
              <div key={property.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                <div className="relative h-72 overflow-hidden">
                  <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-xs font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wide text-gray-900 shadow-sm">
                    {property.tag}
                  </div>
                  <button className="absolute top-4 right-4 p-2.5 bg-black/20 backdrop-blur-md rounded-full hover:bg-white text-white hover:text-red-500 transition-all duration-300">
                    <Heart size={18} className={property.tag === "Coup de Cœur" ? "fill-red-500 text-red-500" : ""} />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold shadow-lg border border-white/10">
                    {property.price}<span className="text-xs font-normal text-gray-300">/mois</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{property.title}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded-md">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" /> {property.rating}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-5 flex items-center gap-1.5">
                    <MapPin size={16} className="text-gray-400" /> {property.location}
                  </p>
                  <div className="flex items-center justify-between text-gray-500 text-sm border-t border-dashed border-gray-200 pt-4">
                    <span className="flex items-center gap-2"><Bed size={18} className="text-blue-500" /> <span className="font-medium">{property.beds}</span> Lits</span>
                    <span className="flex items-center gap-2"><Bath size={18} className="text-blue-500" /> <span className="font-medium">{property.baths}</span> Douches</span>
                    <span className="flex items-center gap-2"><Users size={18} className="text-blue-500" /> <span className="font-medium">{property.guests}</span> Pers.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-10 py-4 bg-white border-2 border-gray-100 text-gray-900 font-bold rounded-full hover:border-blue-600 hover:text-blue-600 transition shadow-sm hover:shadow-md">
              Voir tous les logements
            </button>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITION ================= */}
      <section className="py-24 px-4 md:px-8 bg-[#0F172A] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4">
                <Zap size={14} className="fill-blue-300" /> Pourquoi nous choisir ?
             </div>
             <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
               La location réinventée, <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">simple et sécurisée.</span>
             </h3>
             <p className="text-slate-300 text-lg mb-10 leading-relaxed">
               Fini la paperasse interminable et les frais cachés. Nous avons digitalisé tout le processus pour vous offrir une expérience fluide, de la recherche à la remise des clés.
             </p>
             
             <div className="space-y-6">
                {[
                  { icon: Shield, title: "Paiements Sécurisés", desc: "Votre argent est bloqué jusqu'à ce que vous validiez l'entrée." },
                  { icon: CheckCircle, title: "Annonces Vérifiées", desc: "Chaque logement est inspecté manuellement par notre équipe." },
                  { icon: Clock, title: "Réservation Instantanée", desc: "Pas d'attente. Réservez les logements disponibles immédiatement." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 group">
                     <div className="w-14 h-14 rounded-2xl bg-slate-800 group-hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center flex-shrink-0 text-white shadow-lg border border-slate-700 group-hover:border-blue-500">
                       <item.icon size={26}/>
                     </div>
                     <div>
                       <h4 className="font-bold text-xl mb-1 group-hover:text-blue-300 transition-colors">{item.title}</h4>
                       <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="lg:w-1/2 w-full perspective-1000">
            <div className="relative bg-white p-3 rounded-[2.5rem] shadow-2xl rotate-y-12 rotate-3 hover:rotate-0 transition-all duration-700 ease-out border-8 border-slate-800">
               <img src="https://images.unsplash.com/photo-1556912173-3db996ea0622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="App Preview" className="rounded-[2rem] w-full shadow-inner" />
               <div className="absolute bottom-10 -left-10 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-4 animate-bounce-slow border border-white/50 max-w-xs">
                  <div className="bg-green-100 text-green-600 w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0">
                    <CheckCircle size={28} className="fill-green-100" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Statut</p>
                    <p className="font-bold text-slate-900 text-lg">Réservation Confirmée !</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-24 px-4 md:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Questions Fréquentes</h2>
            <p className="text-gray-500 mt-2 text-lg">Nous avons les réponses.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className={`font-bold text-lg ${activeFaq === index ? "text-blue-600" : "text-gray-800"}`}>{item.q}</span>
                  <ChevronDown className={`transition-transform duration-300 ${activeFaq === index ? "rotate-180 text-blue-600" : "text-gray-400"}`} />
                </button>
                <div 
                  className={`px-6 text-gray-600 leading-relaxed transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === index ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="py-20 px-4 md:px-8 bg-white text-center">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Prêt à trouver votre prochain chez-vous ?</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Rejoignez des milliers de locataires et propriétaires heureux sur Homifi aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/signup')} 
                className="bg-white text-blue-700 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition shadow-xl hover:-translate-y-1 transform duration-200"
              >
                Commencer maintenant
              </button>
              <button 
                onClick={() => navigate('/signin')}
                className="bg-blue-700/50 backdrop-blur-sm border border-blue-400/30 text-white font-bold py-4 px-10 rounded-full hover:bg-blue-700 transition shadow-lg hover:-translate-y-1 transform duration-200"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
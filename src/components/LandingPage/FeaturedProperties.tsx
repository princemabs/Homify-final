import { FaHeart, FaBed, FaStar, FaBath, FaUserFriends } from "react-icons/fa";
import { ArrowRight } from "lucide-react";


const properties = [

    { id: 1, title: "Luxury Villa", location: "Beverly Hills", price: "$4,500/mo", rating: 4.9, beds: 5, baths: 5, guests: 8, image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Modern Apartment", location: "New York City", price: "$3,200/mo", rating: 4.8, beds: 2, baths: 2, guests: 4, image: "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "Cozy Cabin", location: "Aspen", price: "$2,100/mo", rating: 4.7, beds: 3, baths: 2, guests: 6, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" },
];

function FeaturedProperties(){
    return (
        <section className="py-16 px-4 md:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition">
                        View All <ArrowRight className="w-5 h-5" />
                    </a>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((p) => (
                        <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group cursor-pointer border border-gray-100">
                            <div className="relative h-64 overflow-hidden">
                                <img src={p.image} alt={p.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
                                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition">
                                    <FaHeart className="text-gray-400 hover:text-red-500 transition" />
                                </button>
                                <span className="absolute bottom-4 left-4 bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg shadow-lg">
                                    {p.price}
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{p.title}</h3>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                                        <FaStar className="text-yellow-400 w-4 h-4" />
                                        <span className="font-bold text-sm text-gray-700">{p.rating}</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 mb-4 flex items-center gap-1 text-sm">{p.location}</p>

                                <div className="flex justify-between items-center text-gray-500 text-sm border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2"><FaBed /> {p.beds} <span className="hidden sm:inline">beds</span></div>
                                    <div className="flex items-center gap-2"><FaBath /> {p.baths} <span className="hidden sm:inline">baths</span></div>
                                    <div className="flex items-center gap-2"><FaUserFriends /> {p.guests} <span className="hidden sm:inline">guests</span></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default FeaturedProperties;

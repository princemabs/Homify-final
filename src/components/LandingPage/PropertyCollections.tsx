import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CollectionItem {
  title: string;
  description: string;
  image: string;
}
// ... (Ton interface et tableau collections reste le même) ...
const collections = [
  { title: "Serviced Apartments", description: "Furnished apartments with hotel benefits", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=60" },
  { title: "Business Stays", description: "Productive personal working spaces", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60" },
  { title: "Family homes", description: "Family-friendly apartments", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=500&q=60" },
  { title: "Student Housing", description: "Affordable studios for learning", image: "https://images.unsplash.com/photo-1555854743-e3c772ea938d?auto=format&fit=crop&w=500&q=60" },
];

export default function PropertyCollections() {
  return (
    <div className="bg-white py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header avec Flex pour aligner les boutons sur Desktop */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
            <div>
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Collections</h3>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Find the home that fits your needs</h2>
            </div>
            {/* Flèches cachées sur mobile, visibles sur md */}
            <div className="hidden md:flex gap-3">
                <button className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition"><FaChevronLeft className="text-gray-600"/></button>
                <button className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition"><FaChevronRight className="text-gray-600"/></button>
            </div>
        </div>

        {/* Grid Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Section Texte du bas */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            <span className="text-blue-600">Your perfect place</span> is just one click away!
          </h2>
          <p className="text-gray-500 mt-4 text-base md:text-lg">
            Find the furnished apartment that gives you all the freedom you need.
          </p>
        </div>
      </div>
    </div>
  );
}

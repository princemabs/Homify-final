import React from 'react';

const Discover: React.FC = () => {
  return (
    <div className="bg-white py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto"> {/* Élargi le container */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2">Our Solutions</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 max-w-3xl mx-auto">
            Discover Your Next Property, Seamlessly and With Confidence
          </h3>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Experience property search with smart filters, secure payments, and verified listings you can trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {[
            { color: "bg-blue-100 text-blue-600", title: "Smart Filters", desc: "Find properties that match your exact criteria" },
            { color: "bg-green-100 text-green-600", title: "Secure Payments", desc: "Bank-level security for all transactions" },
            { color: "bg-purple-100 text-purple-600", title: "Verified Listings", desc: "Every property is thoroughly checked" },
            { color: "bg-orange-100 text-orange-600", title: "Trusted Process", desc: "Reliable experience from start to finish" }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition duration-300">
               <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0`}>
                 ✓
               </div>
               <div>
                 <h4 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h4>
                 <p className="text-gray-500">{item.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;

import { Star } from "lucide-react";

export default function ProfileCard() {
  return (
    <section className="py-12 px-4 md:px-6 bg-white">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">
          Manage Your Profile
        </h2>

        {/* Layout : Colonne sur mobile, Ligne sur Desktop */}
        <div className="flex flex-col lg:flex-row gap-10 md:gap-16">
          
          {/* Partie Gauche (Info & Form) */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-5">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Profile"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-gray-50 shadow-md"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Sarah Johnson</h3>
                <p className="text-sm text-gray-500">Member since 2021</p>
                <div className="flex items-center gap-1 mt-1 bg-yellow-50 w-fit px-2 py-0.5 rounded text-sm">
                  <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                  <span className="font-bold text-gray-700">4.9</span>
                  <span className="text-gray-400 text-xs">(23 reviews)</span>
                </div>
              </div>
            </div>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" defaultValue="sarah.johnson@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input type="text" defaultValue="+1 (555) 123-4567" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input type="text" defaultValue="San Francisco, CA" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
            </form>
          </div>

          {/* Ligne de séparation sur mobile */}
          <div className="h-px bg-gray-100 lg:hidden"></div>

          {/* Partie Droite (Réservations) */}
          <div className="flex-1 flex flex-col h-full">
            <h4 className="text-lg font-bold mb-6 text-gray-900">Recent Bookings</h4>
            <div className="space-y-4 flex-1">
              {/* Carte Réservation */}
              <div className="flex items-center justify-between border border-gray-100 bg-gray-50/50 rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=100&q=80" alt="Villa" className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm md:text-base">Beachfront Villa</p>
                    <p className="text-xs text-gray-500">Mar 15–20, 2024</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Done</span>
              </div>

              <div className="flex items-center justify-between border border-gray-100 bg-gray-50/50 rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=100&q=80" alt="Retreat" className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm md:text-base">Mountain Retreat</p>
                    <p className="text-xs text-gray-500">Apr 5–10, 2024</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Upcoming</span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 lg:pt-0">
              <button className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium text-gray-600 w-full sm:w-auto">
                Cancel
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-200 w-full sm:w-auto">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

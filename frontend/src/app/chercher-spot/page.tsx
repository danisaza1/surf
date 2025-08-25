'use client';

import { useState } from 'react';
import { Search, Waves, MapPin, ArrowRight } from 'lucide-react';

// A simple Header component to match the provided layout.
const Header = () => (
  <header className="p-4 border-b border-gray-200">
    <nav className="flex items-center justify-between">
      {/* Replaced Next.js Link with a standard anchor tag for compatibility */}
      <a href="/" className="text-xl font-bold text-[#0077B6]">
        SurfApp
      </a>
      <div className="flex space-x-4">
        {/* Replaced Next.js Link with a standard anchor tag for compatibility */}
        <a href="/profile" className="text-sm font-semibold text-gray-700 hover:text-[#00B4D8] transition-colors">
          Profil
        </a>
      </div>
    </nav>
  </header>
);

// A simple Footer component to match the provided layout.
const Footer = () => (
  <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
    © 2024 SurfApp. Tous droits réservés.
  </footer>
);

// Define the structure for a surf spot.
interface SurfSpot {
  key: string;
  name: string;
  location: string;
}

// Data for the surf spots to be displayed.
const surfSpots: SurfSpot[] = [
  { key: 'hossegor', name: 'Hossegor', location: 'Landes, France' },
  { key: 'lacanau', name: 'Lacanau', location: 'Gironde, France' },
  { key: 'biarritz', name: 'Biarritz', location: 'Pyrénées-Atlantiques, France' },
  { key: 'nice', name: 'Nice', location: 'Alpes-Maritimes, France' },
  { key: 'santocha', name: 'Santocha', location: 'Landes, France' },
  { key: 'la-torche', name: 'La Torche', location: 'Finistère, France' },
];

export default function FindSpotPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter the list of surf spots based on the search term.
  const filteredSpots = surfSpots.filter(spot =>
    spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-[url('/surfbg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative flex items-center justify-center p-4">
        {/* Black overlay for better contrast */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="w-full max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-xl relative min-h-[90vh] flex flex-col z-10">
          <div className="relative z-20 hidden md:block">
            <Header />
          </div>

          <main className="flex-1 p-6 space-y-8 md:pb-0 pb-20 flex flex-col">
            {/* Title section */}
            <div className="flex items-center gap-2 mb-6">
              <Waves size={28} className="text-[#00B4D8]" />
              <h1 className="text-3xl font-bold text-[#0077B6]">Trouver un Spot</h1>
            </div>

            {/* Search input field */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Rechercher un spot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* List of filtered spots */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {filteredSpots.length > 0 ? (
                filteredSpots.map(spot => (
                  <a
                    key={spot.key}
                    href={`/hotspot/${spot.key}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <MapPin size={24} className="text-[#0077B6]" />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{spot.name}</p>
                        <p className="text-sm text-gray-500">{spot.location}</p>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-400 group-hover:text-[#00B4D8]" />
                  </a>
                ))
              ) : (
                <div className="text-center text-gray-500 py-10">Aucun spot trouvé.</div>
              )}
            </div>
          </main>

          <div className="hidden md:block">
            <Footer />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <Footer />
      </div>
    </>
  );
}

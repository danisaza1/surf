"use client";

import { useState } from "react";
import { Search, Waves, MapPin, ArrowRight } from "lucide-react";
import MainLayout from "@/components/MainLayout";

// Define the structure for a surf spot.
interface SurfSpot {
  key: string;
  name: string;
  location: string;
}

// Data for the surf spots to be displayed.
const surfSpots: SurfSpot[] = [
  { key: "hossegor", name: "Hossegor", location: "Landes, France" },
  { key: "lacanau", name: "Lacanau", location: "Gironde, France" },
  {
    key: "biarritz",
    name: "Biarritz",
    location: "Pyrénées-Atlantiques, France",
  },
  { key: "nice", name: "Nice", location: "Alpes-Maritimes, France" },
  { key: "santocha", name: "Santocha", location: "Landes, France" },
  { key: "la-torche", name: "La Torche", location: "Finistère, France" },
];

export default function FindSpotPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the list of surf spots based on the search term.
  const filteredSpots = surfSpots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <MainLayout>
          <main className="flex-1 p-6 space-y-8 md:pb-0 pb-20 flex flex-col">
            {/* Title section */}
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Waves size={28} className="text-[#00B4D8]" />
              <h1 className="text-3xl font-bold text-[#0077B6] ">
                Trouver un Spot
              </h1>
            </div>

            {/* Search input field */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Rechercher un spot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all placeholder:text-gray-400"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            {/* List of filtered spots */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => (
                  <a
                    key={spot.key}
                    href={`/hotspot/${spot.key}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <MapPin size={24} className="text-[#0077B6]" />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {spot.name}
                        </p>
                        <p className="text-sm text-gray-500">{spot.location}</p>
                      </div>
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-gray-400 group-hover:text-[#00B4D8]"
                    />
                  </a>
                ))
              ) : (
                <div className="text-center text-gray-500 py-10">
                  Aucun spot trouvé.
                </div>
              )}
            </div>
          </main>
          {/* Pied de page et message */}
        <div className="p-4 md:mt-10 pb-15 md:p-5 text-center text-sm text-gray-500 border-t border-gray-200">
  Bonne session ! 🤙
</div>
                  </MainLayout>
         
    </>
  );
}

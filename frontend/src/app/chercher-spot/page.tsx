"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Search, Waves, MapPin, ArrowRight, XCircle } from "lucide-react";
import MainLayout from "../../components/MainLayout";

// Lista de spots de surf predefinidos con coordenadas completas
const surfSpots = [
  { key: "hossegor", name: "Hossegor", location: "Landes, France", lat: 43.6667, lon: -1.4333 },
  { key: "lacanau", name: "Lacanau", location: "Gironde, France", lat: 45.00, lon: -1.25 },
  { key: "biarritz", name: "Biarritz", location: "Pyrénées-Atlantiques, France", lat: 43.48, lon: -1.55 },
  { key: "nice", name: "Nice", location: "Alpes-Maritimes, France", lat: 43.70, lon: 7.26 },
  { key: "santocha", name: "Santocha", location: "Landes, France", lat: 43.68, lon: -1.42 },
  { key: "la torche", name: "La Torche", location: "Finistère, France", lat: 47.83, lon: -4.31 },
];

export default function FindSpotPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredSpots = surfSpots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:3002/api/favorites", { method: "GET" });
        if (!res.ok) throw new Error("No se pudieron cargar los favoritos");
        const data = await res.json();
        setFavorites(data.map((spot: any) => spot.api_place_id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (spot: { key: string; name: string; location: string; lat: number; lon: number; display_name: string }) => {
    const id = spot.key;
    if (!id) return;

    const isFav = favorites.includes(id);
    const method = isFav ? "DELETE" : "POST";

    try {
      const res = await fetch("http://localhost:3002/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place_id: spot.key,
          name: spot.name,
          latitude: spot.lat,
          longitude: spot.lon,
          display_name: spot.display_name,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar favoritos");

      const data = await res.json();
      setFavorites(data.map((f: any) => f.api_place_id));
    } catch (err) {
      console.error("Error al actualizar favoritos:", err);
    }
  };

  const handleSearch = async (query?: string) => {
    const placeToSearch = query || searchTerm;
  
    if (placeToSearch.trim() === "") {
      return;
    }
    const spotFound = surfSpots.find(
      (s) =>
        s.name.toLowerCase() === placeToSearch.toLowerCase() ||
        s.key === placeToSearch.toLowerCase()
    );

    if (spotFound) {
      router.push(`/hotspot/${spotFound.key}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
      const response = await fetch(`${baseUrl}/api/geocode?place=${encodeURIComponent(placeToSearch)}`);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error al buscar.");
        return;
      }

      const data = await response.json();
      console.log("Datos recibidos del backend:", data);

      if (data.lat && data.lon) {
        router.push(`/hotspot/${placeToSearch.toLowerCase()}`);
      } else {
        setError("Ubicación no encontrada o coordenadas no válidas.");
      }
    } catch (err) {
      console.error("Error al buscar:", err);
      setError("Ha ocurrido un error durante la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainLayout>
        <main className="flex-1 p-6 space-y-8 md:pb-0 pb-20 flex flex-col">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Waves size={28} className="text-[#00B4D8]" />
            <h1 className="text-3xl font-bold text-[#0077B6]">Trouver le spot !</h1>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Buscar un spot..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full text-black pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all placeholder:text-gray-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                <p className="text-[#0077B6] font-semibold">Chargement ...</p>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center justify-center p-3 bg-red-100 text-red-700 rounded-lg">
              <XCircle size={20} className="mr-2" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-4">
            {filteredSpots.length > 0 || searchTerm.trim() !== "" ? (
              <>
                {filteredSpots.map((spot) => (
                  <div
                    key={spot.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner"
                  >
                    <button
                      onClick={() => handleSearch(spot.name)}
                      className="w-full text-left flex items-center gap-4"
                    >
                      <MapPin size={24} className="text-[#0077B6]" />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{spot.name}</p>
                        <p className="text-sm text-gray-500">{spot.location}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleFavorite(spot)}>
                        <Star
                          size={28}
                          className={`transition-colors ${
                            favorites.includes(spot.key)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                      <ArrowRight size={20} className="text-gray-400 hover:text-[#00B4D8]" />
                    </div>
                  </div>
                ))}
                {filteredSpots.length === 0 && searchTerm.trim() !== "" && (
                  <button
                    key="custom-spot"
                    onClick={() => handleSearch(searchTerm)}
                    className="w-full flex items-center text-left justify-between p-4 bg-gray-50 rounded-lg shadow-inner hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <MapPin size={24} className="text-[#0077B6]" />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{searchTerm}</p>
                        <p className="text-sm text-gray-500">
                          {`${searchTerm}`}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-400 hover:text-[#00B4D8]" />
                  </button>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-10">
                Aucun spot trouvé.
              </div>
            )}
          </div>
        </main>
        <div className="p-4 md:mt-10 pb-15 md:p-5 text-center text-sm text-gray-500 border-t border-gray-200">
          ¡Buena sesión! 🤙
        </div>
      </MainLayout>
    </>
  );
}
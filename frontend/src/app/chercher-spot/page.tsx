"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Search, Waves, MapPin, ArrowRight, XCircle } from "lucide-react";
import MainLayout from "../../components/MainLayout";

// Tipo para manejar spots tanto hardcodeados como de API
interface SpotData {
  key: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
  display_name?: string;
  place_id?: string; // Para spots de API
}

// Tipo para los favoritos del backend
interface FavoriteSpot {
  api_place_id: string;
  name: string;
  latitude: number;
  longitude: number;
  display_name?: string;
}

// Lista de spots de surf predefinidos con coordenadas completas
const surfSpots: SpotData[] = [
  {
    key: "hossegor",
    name: "Hossegor",
    location: " , Landes, France",
    lat: 43.6667,
    lon: -1.4333,
    place_id: "hossegor",
  },
  {
    key: "lacanau",
    name: "Lacanau",
    location: " ,Gironde, France",
    lat: 45.0,
    lon: -1.25,
    place_id: "lacanau",
  },
  {
    key: "biarritz",
    name: "Biarritz",
    location: " , Pyrénées-Atlantiques, France",
    lat: 43.48,
    lon: -1.55,
    place_id: "biarritz",
  },
  {
    key: "nice",
    name: "Nice",
    location: " , Alpes-Maritiques, France",
    lat: 43.7,
    lon: 7.26,
    place_id: "nice",
  },
  {
    key: "santocha",
    name: "Santocha",
    location: " , Landes, France",
    lat: 43.68,
    lon: -1.42,
    place_id: "santocha",
  },
  {
    key: "la torche",
    name: "La Torche",
    location: " , Finistère, France",
    lat: 47.83,
    lon: -4.31,
    place_id: "la-torche",
  },
];

export default function FindSpotPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchedSpot, setSearchedSpot] = useState<SpotData | null>(null);

  const filteredSpots = surfSpots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.display_name
  );

  // Cargar favoritos desde el backend
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn(
          "No se encontró el token de acceso. No se cargarán los favoritos."
        );
        return;
      }

      try {
        const res = await fetch("http://localhost:3002/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorBody = await res
            .json()
            .catch(() => ({ error: "Error de servidor" }));
          throw new Error(
            errorBody.error ||
              `No se pudieron cargar los favoritos: ${res.status}`
          );
        }

        const data: FavoriteSpot[] = await res.json();
        setFavorites(data.map((spot) => spot.api_place_id));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        console.error("Error al cargar favoritos:", errorMessage);
      }
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (spot: SpotData) => {
    const spotId = spot.place_id || spot.key;
    if (!spotId) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error(
        "Token de acceso no encontrado. Inicie sesión para añadir favoritos."
      );
      setError("Inicie sesión para añadir/quitar favoritos.");
      return;
    }

    const isFav = favorites.includes(spotId);
    const method = isFav ? "DELETE" : "POST";

    try {
      const res = await fetch("http://localhost:3002/api/favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          place_id: spotId,
          name: spot.name,
          latitude: spot.lat,
          longitude: spot.lon,
          display_name: spot.display_name,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar favoritos");
      const data: FavoriteSpot[] = await res.json();
      setFavorites(data.map((f) => f.api_place_id));
    } catch (err) {
      console.error("Error al actualizar favoritos:", err);
    }
  };

  const searchSpotByAPI = async (query: string): Promise<SpotData | null> => {
    try {
      const apiUrlFromEnv =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `${window.location.protocol}//${window.location.hostname}:3002`;
      const baseUrl = apiUrlFromEnv;
      const response = await fetch(
        `${baseUrl}/api/geocode?place=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al buscar.");
      }
      const data = await response.json();
      if (data.lat && data.lon) {
        return {
          key: query.toLowerCase().replace(/\s+/g, "-"),
          name: data.name,
          location: data.display_name || "",
          lat: parseFloat(data.lat),
          lon: parseFloat(data.lon),
          place_id: data.place_id || query.toLowerCase().replace(/\s+/g, "-"),
        };
      }
      return null;
    } catch (err) {
      console.error("Error al buscar en API:", err);
      return null;
    }
  };

  // Búsqueda automática mientras se escribe
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchedSpot(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const apiSpot = await searchSpotByAPI(searchTerm);
        if (apiSpot) setSearchedSpot(apiSpot);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al buscar en la API";
        setError(errorMessage);
        setSearchedSpot(null);
      } finally {
        setLoading(false);
      }
    }, 500); // debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (spotName: string) => {
    const spotFound = surfSpots.find(
      (s) =>
        s.name.toLowerCase() === spotName.toLowerCase() ||
        s.key === spotName.toLowerCase()
    );
    if (spotFound) {
      router.push(`/hotspot/${spotFound.key}`);
    } else if (searchedSpot) {
      router.push(`/hotspot/${searchedSpot.key}`);
    }
  };

  // Combinar spots hardcodeados con el spot de la API
  const allSpots = [...filteredSpots];
  if (
    searchedSpot &&
    !filteredSpots.some(
      (s) =>
        s.name.toLowerCase() === searchedSpot.name.toLowerCase() ||
        s.location.toLowerCase() === searchedSpot.location.toLowerCase()
    )
  ) {
    allSpots.push(searchedSpot);
  }

  return (
    <MainLayout>
      <main className="flex-1 p-6 space-y-8 md:pb-0 pb-20 flex flex-col">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Waves size={28} className="text-[#00B4D8]" />
          <h1 className="text-3xl font-bold text-[#0077B6]">
            Trouver le spot !
          </h1>
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
                handleSearch(searchTerm);
              }
            }}
            className="w-full text-black pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all placeholder:text-gray-400"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
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

        <div className=" flex-1 overflow-y-auto space-y-4">
          {allSpots.length > 0 ? (
            allSpots.map((spot) => {
              const spotId = spot.place_id || spot.key;
              const isApiSpot = !!spot.place_id;
              const extraName = spot.location
                .split(",")
                .slice(1)
                .map((s) => s.trim())
                .join(", ");

              console.log("Spot:", spot.location, "Extra:", extraName);

              return (
                <div
                  key={spotId}
                  className="  flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner"
                >
                  <button
                    onClick={() => handleSearch(spot.name)}
                    className=" cursor-pointer  w-full text-left flex items-center gap-4"
                  >
                    <MapPin size={24} className="text-[#0077B6]" />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {spot.name.split(",")[0]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isApiSpot ? (
                          <span className="text-sm text-red">{extraName}</span>
                        ) : (
                          spot.location
                        )}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleFavorite(spot)}>
                      <Star
                        size={28}
                        className={`cursor-pointer transition-colors ${
                          favorites.includes(spotId)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    <ArrowRight
                      size={20}
                      className="cursor-pointer text-gray-400 hover:text-[#00B4D8]"
                    />
                  </div>
                </div>
              );
            })
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
  );
}

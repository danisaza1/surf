"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Waves, MapPin, ArrowRight, XCircle } from "lucide-react";
import MainLayout from "../../components/MainLayout";

// Lista de spots de surf predefinidos
const surfSpots = [
  { key: "hossegor", name: "Hossegor", location: "Landes, France" },
  { key: "lacanau", name: "Lacanau", location: "Gironde, France" },
  { key: "biarritz", name: "Biarritz", location: "Pyrénées-Atlantiques, France" },
  { key: "nice", name: "Nice", location: "Alpes-Maritimes, France" },
  { key: "santocha", name: "Santocha", location: "Landes, France" },
  { key: "la torche", name: "La Torche", location: "Finistère, France" },
];

export default function FindSpotPage() {
  // Estado para el término de búsqueda, el estado de carga y los mensajes de error
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [looksurf, setLooksurf] = useState("");

  // Filtra los spots de la lista basándose en el término de búsqueda
  const filteredSpots = surfSpots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Maneja la búsqueda, ya sea a través de la barra de búsqueda o de un botón
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
    // Redirige usando la clave para URL limpia
    router.push(`/hotspot/${spotFound.key}`);
    return; // Detener la función, no llamar a geocoding
  }

  // 2️⃣ Si no está predefinido, llamamos al backend geocode
  setLoading(true);
  setError(null);

    try {
      // Llama a la API de geocodificación en el backend

      const response = await fetch(`
          ${
            process.env.NEXT_PUBLIC_API_URL
          }/api/geocode?place=${encodeURIComponent(placeToSearch)}`);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error al buscar.");
        return;
      }

      const data = await response.json();
      console.log("Datos recibidos del backend:", data);

      if (data.lat && data.lon) {
  // Redirige usando la clave o nombre limpio
  router.push(`/hotspot/${placeToSearch.toLowerCase()}`);
}


else {
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
            <h1 className="text-3xl font-bold text-[#0077B6] ">
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
                  handleSearch();
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

          <div className="flex-1 overflow-y-auto space-y-4">
  {filteredSpots.length > 0 || searchTerm.trim() !== "" ? (
    <>
    {filteredSpots.map((spot) => (
      <button
        key={spot.key}
        onClick={() => handleSearch(spot.name)}
        className="w-full flex items-center text-left justify-between p-4 bg-gray-50 rounded-lg shadow-inner hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <MapPin size={24} className="text-[#0077B6]" />
          <div>
            <p className="text-lg font-semibold text-gray-800">{spot.name}</p>
            <p className="text-sm text-gray-500">{spot.location}</p>
          </div>
        </div>
        <ArrowRight
          size={20}
          className="text-gray-400 hover:text-[#00B4D8]"
        />
      </button>
          ))}
 {/* Affiche le bouton "nouveau" si aucun spot filtré ne correspond mais que l'utilisateur a écrit quelque chose */}
      {filteredSpots.length === 0 && searchTerm.trim() !== "" && (
        <button
          key="custom-spot"
          onClick={() => handleSearch(searchTerm)}
          className="w-full flex items-center text-left justify-between p-4 bg-gray-50 rounded-lg shadow-inner hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <MapPin size={24} className="text-[#0077B6]" />
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {searchTerm}
              </p>
              <p className="text-sm text-gray-500">France</p>
            </div>
          </div>
          <ArrowRight
            size={20}
            className="text-gray-400 hover:text-[#00B4D8]"
          />
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

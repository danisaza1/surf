"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FlagTriangleRight } from "lucide-react";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import Image from "next/image";
import MainLayout from "@/components/MainLayout";
import { useEffect } from "react";

// Array de spots de surf en Francia (lat/lon)
const surfSpots = [
  { name: "Hossegor", lat: 43.665, lon: -1.4273 },
  { name: "Lacanau", lat: 45.0007, lon: -1.2039 },
  { name: "Biarritz", lat: 43.4832, lon: -1.5586 },
  { name: "Nice", lat: 43.695, lon: 7.265 },
  { name: "Anglet", lat: 43.487, lon: -1.558 },
  { name: "La Torche", lat: 47.869, lon: -4.362 },
  { name: "Capbreton", lat: 43.655, lon: -1.425 },
  { name: "Seignosse", lat: 43.665, lon: -1.425 },
  { name: "Bretagne – Plouharnel", lat: 47.617, lon: -3.033 },
  { name: "Saint Girons", lat: 43.66, lon: -1.387 },
  { name: "Vieux Boucau", lat: 43.65, lon: -1.417 },
  { name: "Mimizan", lat: 44.125, lon: -1.25 },
  { name: "Côte des Basques", lat: 43.48, lon: -1.569 },
  { name: "Tarnos", lat: 43.576, lon: -1.52 },
  { name: "Sables d'Or", lat: 48.779, lon: -3.437 },
];

export default function SurfMapPage() {
  // Crear el icono usando el componente FlagTriangleRight
  const createFlagIcon = () => {
    const svgString = ReactDOMServer.renderToStaticMarkup(
      <FlagTriangleRight color="#0077B6" size={24} />
    );

    return L.divIcon({
      html: svgString,
      className: "", // eliminar clases por defecto
      iconSize: [24, 24],
      iconAnchor: [12, 24], // el punto donde "apunta" el pin
      popupAnchor: [0, -24],
    });
  };

  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long'};
  const today = new Intl.DateTimeFormat('fr-FR', options).format(currentDate).charAt(0).toUpperCase() + new Intl.DateTimeFormat('fr-FR', options).format(currentDate).slice(1);

    const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;

  // Exemple : fetch côté client (dans useEffect)
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${baseUrl}/api/geocode?place=${encodeURIComponent("Hossegor")}`);
      const data = await res.json();
      console.log(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <MainLayout>
          
          <main className="flex-1 p-6 space-y-8 md:pb-0 pb-15">
              {/* Section de Bienvenue */}
                       <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                         <div>
                           <h1 className="text-3xl font-bold text-[#0077B6]">
                             Bienvenue, thomas !
                           </h1>
                           <p className="text-sm text-gray-500 mt-1">
                    {today}, {currentDate.toLocaleDateString()}
                           </p>
                         </div>
                         <div className="relative w-20 h-20 flex-shrink-0">
                           <Image
                             src="/profile.jpg"
                             alt="Profile"
                             fill
                             sizes="(max-width: 768px) 100vw,
               (max-width: 1200px) 50vw,
               33vw"
                             className="rounded-full border-4 border-[#00B4D8] shadow-lg object-cover"
                           />
                         </div>
                       </div>

            <div>
              <MapContainer
                center={[46.603354, 1.888334]} // centro aproximado de Francia
                zoom={5}
                scrollWheelZoom={true}
                className="w-full h-[50vh] md:h-[60vh]"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {surfSpots.map((spot) => (
                  <Marker
                    key={spot.name}
                    position={[spot.lat, spot.lon]}
                    icon={createFlagIcon()}
                  >
                    <Popup>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#0077B6]">
                          {spot.name}
                        </span>
                        <span className="text-gray-600 text-sm">
                          Spot de surf en Francia 🌊
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-200 pb-8">
              Bonne session ! 🤙
            </div>
          </main>
          
          </MainLayout>
    </>
  );
}
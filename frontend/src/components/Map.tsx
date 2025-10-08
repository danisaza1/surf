"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { FlagTriangleRight } from "lucide-react";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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

export default function SurfMap() {
  // useMemo evita recrear el icono en cada render
  const flagIcon = useMemo(() => {
    const svgString = ReactDOMServer.renderToStaticMarkup(
      <FlagTriangleRight color="#0077B6" size={24} />
    );
    return L.divIcon({
      html: svgString,
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  }, []);

  return (
    <MapContainer
      center={[46.603354, 1.888334]} // centro de Francia
      zoom={5}
      scrollWheelZoom
      className="w-full h-[50vh] md:h-[60vh]"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {surfSpots.map((spot) => (
        <Marker key={spot.name} position={[spot.lat, spot.lon]} icon={flagIcon}>
          <Popup>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-[#0077B6]">{spot.name}</span>
              <span className="text-gray-600 text-sm">
                Spot de surf en France 🌊
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

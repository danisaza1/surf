// app/profile/page.tsx
import Image from "next/image";
import { User, MapPin, Waves, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

// Optionnel: Définir l'interface
interface UserProfile {
  name: string;
  location: string;
  surfLevel: string;
}

export default function ProfilePage() {
  const user: UserProfile = {
    name: "BOSS, Albert",
    location: "Promenade des Anglais, Nice",
    surfLevel: "Intermédiaire",
  };

  const bestSpots = ["Hossegor", "Lacanau", "Biarritz", "Nice"];

  return (
    <>
      <div className="min-h-screen bg-[url('/surfbg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative flex items-center justify-center p-4">
        {/* Overlay noir */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="w-full max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-xl relative">
          <div className="relative z-20 hidden md:block">
            <Header />
          </div>

          <div className="flex-1 p-6 space-y-8 md:pb-0 pb-15">
            {" "}
            {/* Section de Bienvenue */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-3xl font-bold text-[#0077B6]">
                  Bienvenue, thomas !
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Lundi, Août 10 - 2025
                </p>
              </div>
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src="/profile.png"
                  alt="Profile"
                  fill
                  className="rounded-full border-4 border-[#00B4D8] shadow-lg object-cover"
                />
              </div>
            </div>
            {/* Section du Profil */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User size={20} className="text-[#00B4D8]" /> Profil
              </h2>
              <div className="bg-gray-50 rounded-lg p-5 shadow-inner space-y-4">
                <div className="flex items-center gap-4">
                  <MapPin size={20} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">
                      Localisation
                    </p>
                    <p className="font-semibold text-gray-800 truncate">
                      {user.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Waves size={20} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      Niveau de Surf
                    </p>
                    <p className="font-semibold text-gray-800">
                      {user.surfLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Section Classement con enlaces dinámicos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-[#00B4D8]" />
                Classement des meilleurs spots
              </h2>
              <ul className="bg-gray-50 rounded-lg p-5 shadow-inner space-y-4">
                {bestSpots.map((spot) => (
                  <li key={spot}>
                    <Link
                      href={`/hotspot/${spot.toLowerCase()}`}
                      className="block text-center bg-[#00B4D8] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-[#0096C7] transition-colors"
                    >
                      {spot}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-gray-600 flex justify-center">
              Comment lire des prévisions de surf ?
              <a href="guide" className="ml-1 text-gray-800 hover:underline">
                Consultez notre guide
              </a>
            </div>
            {/* Footer & Mensaje */}
            <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-200 pb-10">
              Bonne session ! 🤙
            </div>
          </div>

          {/* Footer en desktop - dentro de la card */}
          <div className="hidden md:block">
            <Footer />
          </div>
        </div>
      </div>

      {/* Footer flotante en móvil - fuera del contenedor principal */}
      <div className="md:hidden">
        <Footer />
      </div>
    </>
  );
}

// app/profile/page.tsx
import Image from "next/image";
import { User, MapPin, Waves, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";

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

  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long'};
  const today = new Intl.DateTimeFormat('fr-FR', options).format(currentDate).charAt(0).toUpperCase() + new Intl.DateTimeFormat('fr-FR', options).format(currentDate).slice(1);

  return (
    <>
    <MainLayout>
    
          <div className="flex flex-col md:flex-row flex-1 p-6 space-y-8 md:space-y-0 md:space-x-8">
            {/* Colonne de gauche : Informations du profil */}
            <div className="md:w-1/2 md:border-r border-gray-200 md:pr-4">
              {/* Section de Bienvenue */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-3xl text-[#0077B6]">
                    Bienvenue, {user.name.split(",")[0].trim()} !
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {today}, {currentDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src="/profile.png"
                    alt="Profile"
                    fill
                    sizes="(max-width: 768px) 100vw,
               (max-width: 1200px) 50vw,
               33vw"
                    className="rounded-full border-4 border-[#00B4D8] shadow-lg object-cover"
                  />
                </div>
              </div>
              {/* Section du Profil */}
              <div className="space-y-4 mt-8">
                <h2 className="text-xl text-gray-800 flex justify-center gap-2">
                  <User size={20} className="text-[#00B4D8]" /> Profil
                </h2>
                <div className="bg-amber-50 rounded-lg p-5 shadow-inner space-y-4">
                  <div className="flex items-center gap-4">
                    <MapPin size={20} className="text-gray-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500">
                        Localisation
                      </p>
                      <p className="text-gray-800 truncate">
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
                      <p className="text-gray-800">
                        {user.surfLevel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne de droite : Classement et informations */}
            <div className="md:w-1/2 md:pl-4">
              {/* Section Classement */}
              <div className="space-y-4 pt-8 md:pt-0">
                <h2 className="text-xl text-gray-800 flex justify-center gap-2">
                  <CheckCircle2 size={20} className="text-[#00B4D8]" />
                  Classement des meilleurs spots
                </h2>
                <ul className="bg-gray-50 rounded-lg p-5 shadow-inner space-y-4">
                  {bestSpots.map((spot) => (
                    <li key={spot}>
                      <Link
                        href={`/hotspot/${spot.toLowerCase()}`}
                        className="block text-center bg-[#00B4D8] text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#0096C7] transition-colors"
                      >
                        {spot}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-gray-600 flex flex-col items-center mt-8">
                <p className="text-center">
                  Comment lire des prévisions de surf ?
                </p>
                <a href="guide" className="ml-1 text-gray-800 underline md:no-underline md:hover:underline">
    Consultez notre guide
</a>
              </div>
            
            </div>
          </div>
       {/* Pied de page et message */}
        <div className="p-4 pb-15 md:p-5 text-center text-sm text-gray-500 border-t border-gray-200">
  Bonne session ! 🤙
</div>
         </MainLayout>
    </>
  );
}
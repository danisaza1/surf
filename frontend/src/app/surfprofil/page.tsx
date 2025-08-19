// app/profile/page.tsx
import Image from "next/image";
import { User } from "lucide-react";

// Optionnel: Définir l'interface directement ici si elle n'est pas réutilisée
interface UserProfile {
  name: string;
  location: string;
  surfLevel: string;
}

export default function ProfilePage() {
  // Définir les données avec le type UserProfile
  const user: UserProfile = {
    name: "BOSS, Albert",
    location: "Promenade des Anglais, Nice",
    surfLevel: "Intermédiaire",
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden bg-white min-h-screen flex flex-col">
      <header className="bg-[#0077B6] text-white text-center py-3 font-bold text-lg">
        Waveo
      </header>
      <div className="flex-1 p-4">
        {/* Welcome Section */}
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-[#00B4D8]">
              Bienvenue, Abeso !
            </h1>
            <p className="text-sm text-[#2D3A40] opacity-80">
              Lundi, Août 10 - 2025
            </p>
          </div>
          <Image
            src="/profile.png"
            alt="Profile"
            width={60}
            height={60}
            className="rounded-full border border-gray-200"
          />
        </div>

        {/* Profil Section */}
        <div className="px-4 py-2">
          <h2 className="font-semibold text-[#00B4D8] mb-2">Profil :</h2>
          <div className="bg-[#E8EEF0] rounded-lg p-3 space-y-3 text-sm">
            {/* Nom & Prénom */}
            <div className="flex justify-between items-start">
              <p className="font-normal text-[#2D3A40] opacity-80 shrink-0">
                Nom & Prénom :
              </p>
              <p className="text-[#2D3A40] font-medium text-right ml-2">
                {user.name}
              </p>
            </div>
            {/* Localisation */}
            <div className="flex justify-between items-start">
              <p className="font-normal text-[#2D3A40] opacity-80 shrink-0">
                Localisation :
              </p>
              <p className="text-[#2D3A40] font-medium text-right ml-2">
                {user.location}
              </p>
            </div>
            {/* Niveau du surf */}
            <div className="flex justify-between items-start">
              <p className="font-normal text-[#2D3A40] opacity-80 shrink-0">
                Niveau du surf :
              </p>
              <p className="text-[#2D3A40] font-medium text-right ml-2">
                {user.surfLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Classement */}
        <div className="px-4 py-3">
          <h2 className="font-semibold text-[#00B4D8] mb-3">
            Classement des meilleurs spots de surf :
          </h2>
          <ul className="bg-[#E8EEF0] rounded-lg p-3 space-y-3 ">
            {["Hossegor", "Lacanau", "Nice", "Biarritz"].map((spot, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#00B4D8]" />
                <span className="text-[#2D3A40] font-medium">{spot}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer & Logout Button */}
      <div className="w-full">
        <div className="px-4 py-2 text-center text-sm text-[#2D3A40] opacity-70">
          Bonne session !
        </div>
        <button className="w-full bg-[#0077B6] hover:bg-[#005F99] transition-colors text-white py-3 flex items-center justify-center gap-2 text-sm font-medium">
          <User size={16} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}
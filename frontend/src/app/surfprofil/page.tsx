import Image from "next/image";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-[#0077B6] text-white text-center py-3 font-bold text-lg">
        Waveo
      </div>

      {/* Welcome Section */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-xl font-bold text-[#34A0A4]">
            Bienvenue, Abeso !
          </h1>
          <p className="text-sm text-gray-600">Lundi, Août 10 / 2025</p>
        </div>
        <Image
          src="/profile.png"
          alt="Profile"
          width={60}
          height={60}
          className="rounded-full border"
        />
      </div>

      {/* Profil Section */}
      <div className="px-4 py-2">
        <h2 className="font-semibold text-[#34A0A4] mb-2">Profil :</h2>
        <div className="bg-[#e8eeef] rounded-lg p-3 space-y-2 text-sm ">
          <div className="flex justify-between">
            <p className="font-normal text-gray-600">Nom & Prénom :</p>
            <p className="text-black"> BOSS, Albert</p>
          </div>
          <div className="flex justify-between">
            <p className="font-normal text-gray-600">Localisation :</p>
            <p className="text-black"> Promenade des Anglais, Nice</p>
          </div>
          <div className="flex justify-between">
            <p className="font-normal text-gray-600">Niveau du surf :</p>
            <p className="text-black"> Intermédiaire</p>
          </div>
        </div>
      </div>

      {/* Classement */}
      <div className="px-4 py-3">
        <h2 className="font-semibold text-[#34A0A4] mb-3">
          Classement des meilleurs spots de surf :
        </h2>
        <ul className="bg-[#e8eeef] rounded-lg p-3 space-y-3 ">
          {["Hossegor", "Lacanau", "Nice", "Biarritz"].map((spot, idx) => (
            <li key={idx} className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-[#00B4D8]" />
              <span className="text-gray-800 font-medium">{spot}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 text-center text-sm text-gray-600">
        Let's enjoy your surfing !
      </div>

      {/* Logout Button */}
      <button className="w-full bg-[#0077B6] hover:bg-[#34A0A4] transition-colors text-white py-3 flex items-center justify-center gap-2 text-sm font-medium">
        <User size={16} /> Se déconnecter
      </button>
    </div>
  );
}

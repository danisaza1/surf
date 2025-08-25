"use client";
import Image from "next/image";
import {
  User,
  MapPin,
  Waves,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
} from "lucide-react";
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
interface UserProfile {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  surfLevel: string;
  phone: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: "Abeso",
    password: "123456",
    email: "example@free.fr",
    firstName: "thomas",
    lastName: "BOSS",
    location: "Promenade des Anglais, Nice",
    surfLevel: "Intermédiaire",
    phone: "+33 6 12 34 56 78",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentData = isEditing ? editedProfile : profile;

  return (
       <MainLayout>
       

        {/* Section principale avec deux colonnes sur desktop */}
        <div className="flex flex-col justify-center md:flex-row p-6 md:p-8 md:space-x-8">
          
          {/* Colonne de gauche: Salutation et Image de profil */}
          <div className="flex flex-col items-center text-center pb-4 md:pb-0 md:w-1/3 md:flex-shrink-0 md:justify-center md:items-start md:text-left">
            
            {/* Image de profil plus grande sur desktop */}
            <div className="relative w-24 h-24 md:w-40 md:h-40 flex-shrink-0 mx-auto md:mx-0 mb-4">
              <Image
                src="/profile.png"
                alt="Profile"
                fill
                className="rounded-full border-4 border-[#00B4D8] shadow-lg object-cover"
              />
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="absolute -bottom-1 -right-1 bg-[#00B4D8] text-white p-1.5 rounded-full shadow-lg hover:bg-[#0077B6] transition-colors md:p-2"
                >
                  <Edit3 size={12} className="md:w-5 md:h-5" />
                </button>
              )}
            </div>

            {/* Texte de bienvenue */}
            <div className="mt-4 md:mt-0">
              <h1 className="text-3xl font-bold text-[#0077B6] md:text-4xl lg:text-5xl">
                Bienvenue,
              </h1>
              <p className="text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                {currentData.firstName}!
              </p>
              <p className="text-sm text-gray-500 mt-2 md:text-base">
                Lundi, Août 19 - 2025
              </p>
            </div>
          </div>

          {/* Colonne de droite: Informations du profil */}
          <div className="space-y-6 md:border-l md:border-gray-200 md:pl-8  ">
            <h2 className="text-xl font-semibold text-gray-800 flex md:justify-center gap-2">
              <User size={20} className="text-[#00B4D8]" /> Profil
            </h2>
            <div className="bg-gray-50 rounded-lg p-5 shadow-inner space-y-6">
              
              {/* Grille pour les informations */}
<div className="flex flex-col space-y-4 md:space-y-6">
                
                {/* Champ: Nom d'utilisateur */}
                <div className="flex items-center gap-4">
                  <User size={16} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                    <p className="text-sm font-medium text-gray-500">Nom d'utilisateur</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{currentData.username}</p>
                    )}
                  </div>
                </div>

                {/* Champ: Mot de passe */}
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full ml-0.5"></div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                    <p className="text-sm font-medium text-gray-500">Mot de passe</p>
                    {isEditing ? (
                      <input
                        type="password"
                        value={currentData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">••••••</p>
                    )}
                  </div>
                </div>

                {/* Champ: Email */}
                <div className="flex items-center gap-4">
                  <Mail size={16} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={currentData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto truncate mt-1 sm:mt-0"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 truncate">{currentData.email}</p>
                    )}
                  </div>
                </div>

                {/* Champ: Prénom */}
                <div className="flex items-center gap-4">
                  <User size={16} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                    <p className="text-sm font-medium text-gray-500">Prénom</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{currentData.firstName}</p>
                    )}
                  </div>
                </div>

                {/* Champ: Nom */}
                <div className="flex items-center gap-4">
                  <User size={16} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{currentData.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Champ: Téléphone */}
                <div className="flex items-center gap-4">
                  <Phone size={16} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={currentData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 text-sm">{currentData.phone}</p>
                    )}
                  </div>
                </div>

                {/* Champ: Localisation */}
                <div className="flex items-center gap-4">
                  <MapPin size={16} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                    <p className="text-sm font-medium text-gray-500">Localisation</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 truncate">{currentData.location}</p>
                    )}
                  </div>
                </div>

                {/* Champ: Niveau de Surf */}
                <div className="flex items-center gap-4">
                  <Waves size={16} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                    <p className="text-sm font-medium text-gray-500">Niveau de Surf</p>
                    {isEditing ? (
                      <select
                        value={currentData.surfLevel}
                        onChange={(e) => handleInputChange("surfLevel", e.target.value)}
                        className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                      >
                        <option value="Débutant">Débutant</option>
                        <option value="Intermédiaire">Intermédiaire</option>
                        <option value="Avancé">Avancé</option>
                        <option value="Expert">Expert</option>
                      </select>
                    ) : (
                      <p className="font-semibold text-gray-800">{currentData.surfLevel}</p>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Boutons d'action */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#00B4D8] text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#0077B6] transition-colors"
                >
                  <Save size={16} />
                  Sauvegarder
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-500 transition-colors"
                >
                  <X size={16} />
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pied de page et message */}
        <div className="p-4 pb-15 md:p-5 text-center text-sm text-gray-500 border-t border-gray-200">
  Bonne session ! 🤙
</div>
             </MainLayout>
    
  );
}
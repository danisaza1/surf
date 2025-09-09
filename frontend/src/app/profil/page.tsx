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
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";

// ✅ Actualiza la interfaz para reflejar los datos de los favoritos
interface FavoriteSpot {
  id: number;
  api_place_id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface UserProfile {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  surfLevel: string;
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
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  // ✅ El estado ahora es un array de objetos FavoriteSpot
  const [favorites, setFavorites] = useState<FavoriteSpot[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:3002/api/favorites");
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (err) {
        console.error("Error al cargar los favoritos", err);
      }
    };
    fetchFavorites();
  }, []);

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

  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  const today = new Intl.DateTimeFormat('fr-FR', options).format(currentDate).charAt(0).toUpperCase() + new Intl.DateTimeFormat('fr-FR', options).format(currentDate).slice(1);


  return (
    <MainLayout>
      <div className="flex flex-col justify-center md:flex-row p-6 md:p-8 md:space-x-8">
        <div className="flex flex-col items-center text-center pb-4 md:pb-0 md:w-1/3 md:flex-shrink-0 md:justify-center md:items-start md:text-left">
          <div className="relative w-24 h-24 md:w-40 md:h-40 flex-shrink-0 mx-auto md:mx-0 mb-4">
            <Image
              src="/profile.png"
              alt="Profile"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <div className="mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-[#0077B6] md:text-4xl lg:text-5xl">
              Bienvenue,
            </h1>
            <p className="text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
              {currentData.firstName}!
            </p>
            <p className="text-sm text-gray-500 mt-2 md:text-base">
              {today}, {currentDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-6 md:border-l md:border-gray-200 md:pl-8">
          <h2 className="text-xl font-semibold text-gray-800 flex md:justify-center gap-2">
            <User size={20} className="text-[#00B4D8]" /> Profil
          </h2>
          <div className="bg-gray-50 rounded-lg p-5 shadow-inner space-y-6">
            <div className="flex flex-col space-y-4 md:space-y-6">
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

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 flex gap-2 items-center">
              <Star size={20} className="text-yellow-400" /> Mes favoris
            </h2>
            {favorites.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {/* ✅ Renderizar la propiedad 'name' y usar 'api_place_id' como clave */}
                {favorites.map((fav) => (
                  <li
                    key={fav.api_place_id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-inner"
                  >
                    <span className="text-gray-800 font-medium">{fav.name}</span>
                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-4">Aucun favori pour l’instant.</p>
            )}
          </div>

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
      <div className="p-4 pb-15 md:p-5 text-center text-sm text-gray-500 border-t border-gray-200">
        Bonne session ! 🤙
      </div>
    </MainLayout>
  );
}
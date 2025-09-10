"use client";
import Image from "next/image";
import { User, MapPin, Waves, Edit3, Save, X, Mail, Star } from "lucide-react";
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { useRouter } from "next/navigation";

interface FavoriteSpot {
  id: number;
  api_place_id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface UserProfile {
  id: number;
  prenom: string;
  nom: string;
  adresse: string;
  surf: string;
  utilisateur: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
 const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
 
  const [loading, setLoading] = useState(true);


  // ✅ El estado ahora es un array de objetos FavoriteSpot
  const [user, setUser] = useState<UserProfile | null>(null);

  const [favorites, setFavorites] = useState<FavoriteSpot[]>([]);

    // Récupérer le profil utilisateur
  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
        const response = await fetch(`${baseUrl}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Erreur lors du chargement du profil");
        const userData = await response.json();
        setProfile(userData);
        setEditedProfile(userData);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

// second useEffect pour récupérer les favoris
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        setLoading(false);
        return;
      }

      try {
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
        const response = await fetch(`${baseUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const userData = await response.json();
        setUser(userData);
        setEditedProfile(userData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:3002/api/favorites");
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
    fetchFavorites();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      setIsEditing(false);
      // je dois ici ajouter un appel API pour sauvegarder les modifs côté serveur à faire dans un second temps
    }
  };

  const handleCancel = () => {
    setEditedProfile(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => prev ? { ...prev, [field]: value } : prev);
  };


  const currentData = isEditing ? editedProfile : profile;
  const router = useRouter();
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  const today =
    new Intl.DateTimeFormat("fr-FR", options)
      .format(currentDate)
      .charAt(0)
      .toUpperCase() +
    new Intl.DateTimeFormat("fr-FR", options)
      .format(currentDate)
      .slice(1);

  if (loading || !currentData) return <MainLayout>Chargement...</MainLayout>;

  return (
    <MainLayout>
      <div className="flex flex-col justify-center md:flex-row p-6 md:p-8 md:space-x-8">
        {/* PROFILE IMAGE & GREETING */}
        <div className="flex flex-col items-center text-center pb-4 md:pb-0 md:w-1/3 md:flex-shrink-0 md:justify-center md:items-start md:text-left">
          <div className="relative w-24 h-24 md:w-40 md:h-40 flex-shrink-0 mx-auto md:mx-0 mb-4">
            <Image
              src="/profile.jpg"
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
              {currentData?.utilisateur}!
            </p>
            <p className="text-sm text-gray-500 mt-2 md:text-base">
              {today}, {currentDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* PROFILE DETAILS & FAVORITES */}
        <div className="space-y-6 md:border-l md:border-gray-200 md:pl-8">
          {/* Perfil Form */}
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
                      value={currentData?.utilisateur}
                      onChange={(e) => handleInputChange("utilisateur", e.target.value)}
                      className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">{currentData?.utilisateur}</p>
                  )}
                </div>
              </div>

              {/* <div className="flex items-center gap-4">
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
              </div> */}

       <div className="flex items-center gap-4">
                <Mail size={16} className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentData?.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto truncate mt-1 sm:mt-0"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800 truncate">{currentData?.email}</p>
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
                      value={currentData?.prenom}
                      onChange={(e) => handleInputChange("prenom", e.target.value)}
                      className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">{currentData?.prenom}</p>
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
                      value={currentData?.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">{currentData?.nom}</p>
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
                      value={currentData?.adresse}
                      onChange={(e) => handleInputChange("adresse", e.target.value)}
                      className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800 truncate">{currentData?.adresse}</p>
                  )}
                </div>
              </div>

   <div className="flex items-center gap-4">
                <Waves size={16} className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                  <p className="text-sm font-medium text-gray-500">Niveau de Surf</p>
                  {isEditing ? (
                    <select
                      value={currentData?.surf}
                      onChange={(e) => handleInputChange("surf", e.target.value)}
                      className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-auto mt-1 sm:mt-0"
                    >
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Expert">Expert</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-gray-800">{currentData?.surf}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <Link href="/change-profile"> */}
           <button
                onClick={() => router.push("/change-profile")}
                className="flex-1 bg-[#00B4D8] text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#0077B6] transition-colors"
              >
                <Save size={16} />
                changer vos informations
              </button>
          {/* </Link> */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 flex gap-2 items-center">
              <Star size={20} className="text-yellow-400" /> Mes favoris
            </h2>
            {favorites.length > 0 ? (
              <ul className="mt-4 space-y-3">
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

          {/* Editing buttons */}
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

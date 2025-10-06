"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import MainLayout from "@/components/MainLayout";
import { User, MapPin, Waves, Edit3, Save, X, Mail, Star } from "lucide-react";

interface FavoriteSpot {
  key: string;
  id: number;
  api_place_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  display_name?: string;
}

interface UserProfile {
  username: string;
  password: string;
  email: string;
  prenom: string;
  nom: string;
  location: string;
  surf_level: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteSpot[]>([]);
  const [removedFavoriteIds, setRemovedFavoriteIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const profileResponse = await fetch(`${baseUrl}/profile`, { headers });
        
        if (!profileResponse.ok) {
          throw new Error(`Profile fetch failed with status: ${profileResponse.status}`);
        }

        const userData = await profileResponse.json();
        const initialProfile: UserProfile = { ...userData, password: '' };

        setUser(initialProfile);
        setEditedProfile(initialProfile);

        const favoritesResponse = await fetch(`${baseUrl}/api/favorites`, { headers });

        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          setFavorites(favoritesData);
        } else {
          console.warn(`Favorites fetch returned status: ${favoritesResponse.status}`);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []); 

  const toggleFavoriteRemoval = (spot: FavoriteSpot) => {
    if (!spot.api_place_id) return; 

    setRemovedFavoriteIds((prev) =>
      prev.includes(spot.api_place_id)
        ? prev.filter((id) => id !== spot.api_place_id)
        : [...prev, spot.api_place_id]
    );
  };

  const handleEdit = () => {
    setStatusMessage(null);
    setIsEditing(true);
    setRemovedFavoriteIds([]);
    setEditedProfile(prev => (prev ? {...prev, password: ''} : null));
  };

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user || !editedProfile) {
    console.error("Vous devez être connecté pour sauvegarder votre profil.");
    return;
  }
  
  // 1. Preparamos el payload con los campos que no son el email ni la contraseña
  const profileUpdates: { [key: string]: any } = {};

  // Lista de campos a revisar, excluyendo 'password'
  const fieldsToCheck: (keyof UserProfile)[] = [
      'username', 'prenom', 'nom', 'location', 'surf_level'
  ];

  // 2. Comparamos los campos y agregamos solo los que cambiaron
  fieldsToCheck.forEach(field => {
      // Nota: Aquí se usa 'surf_level' en el frontend, que se mapea a 'surf' en el backend
      const backendField = field === 'surf_level' ? 'surf' : field;
      
      if (editedProfile[field] !== user[field]) {
          profileUpdates[backendField] = editedProfile[field];
      }
  });

  // 3. Manejar el campo EMAIL por separado
  if (editedProfile.email !== user.email) {
      profileUpdates.email = editedProfile.email;
  } else if (editedProfile.email === user.email) {
      // Si el email NO ha cambiado, NO lo envíes en el payload.
      // Esto evita que el backend haga la comprobación de unicidad
      // para un valor que ya está en la base de datos (incluso si es el suyo).
      // Aunque tu backend lo maneja, esta capa extra de protección es buena.
  }
  
  // 4. Manejar el campo PASSWORD
  if (editedProfile.password && editedProfile.password.trim().length > 0) {
    profileUpdates.password = editedProfile.password;
  }
  
  // 5. Agregar los favoritos a eliminar SIEMPRE
  profileUpdates.removedFavorites = removedFavoriteIds;

  // VERIFICACIÓN IMPORTANTE: Si no hay cambios (salvo favoritos), no enviar.
  if (Object.keys(profileUpdates).length === 0 && removedFavoriteIds.length === 0) {
    setStatusMessage({ type: 'error', message: "Aucun changement détecté à sauvegarder." });
    setIsEditing(false); // Opcional: salir del modo edición
    return;
  }

  // Ahora el payload solo tiene los cambios, incluyendo el email SOLO si ha cambiado.
  console.log("Envoi du payload:", { ...profileUpdates, password: profileUpdates.password ? '***' : undefined });

    try {
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
      const token = localStorage.getItem("accessToken");
      
      const res = await fetch(`${baseUrl}/api/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(profileUpdates),
      });

      console.log("Statut de la réponse:", res.status);

      if (res.ok) {
        const updatedUserData = await res.json();
        console.log("Données utilisateur mises à jour:", updatedUserData);
        
        const updatedUser: UserProfile = {
          ...updatedUserData, 
          password: ''
        };
        
        setUser(updatedUser);
        setEditedProfile(updatedUser);

        setFavorites((prev) => 
          prev.filter((fav) => !removedFavoriteIds.includes(fav.api_place_id))
        );
        
        setRemovedFavoriteIds([]);
        setIsEditing(false);
        setStatusMessage({ type: 'success', message: "Profil mis à jour avec succès !" });

      } else {
        const errorData = await res.json();
        console.error("Erreur API:", errorData);
        const errorMessage = errorData.error || "Échec de la mise à jour du profil.";
        setStatusMessage({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil:", error);
      setStatusMessage({ type: 'error', message: "Erreur de connexion au serveur." });
    }
  };

  const handleCancel = () => {
    setEditedProfile(user ? { ...user, password: '' } : null); 
    setRemovedFavoriteIds([]);
    setIsEditing(false);
    setStatusMessage(null);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const currentData = isEditing ? editedProfile : user;
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  const today =
    new Intl.DateTimeFormat("fr-FR", options)
      .format(currentDate)
      .charAt(0)
      .toUpperCase() +
    new Intl.DateTimeFormat("fr-FR", options).format(currentDate).slice(1);

  if (loading || !currentData)
    return (
      <MainLayout>
        <div className="mt-20 text-center w-full h-24 text-black">Chargement...</div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <form onSubmit={handleSave}>
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
                  type="button"
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
                {user?.username} !
              </p>
              <p className="text-sm text-gray-500 mt-2 md:text-base">
                {today}, {currentDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* PROFILE DETAILS & FAVORITES */}
          <div className="space-y-6 md:border-l md:border-gray-200 md:pl-8 md:w-2/3">
            {/* Message de statut */}
            {statusMessage && (
              <div className={`p-4 rounded-lg ${
                statusMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {statusMessage.message}
              </div>
            )}

            {/* Profil Form */}
            <h2 className="text-xl font-semibold text-gray-800 flex md:justify-center gap-2">
              <User size={20} className="text-[#00B4D8]" /> Profil
            </h2>
            <div className="bg-gray-50 rounded-lg p-5 shadow-inner space-y-6">
              <div className="flex flex-col space-y-4 md:space-y-6">
                {[
                  { label: "Nom d'utilisateur", field: "username", icon: User, type: "text" },
                  { label: "Mot de passe", field: "password", icon: User, type: "password" },
                  { label: "Email", field: "email", icon: Mail, type: "email" },
                  { label: "Prénom", field: "prenom", icon: User, type: "text" },
                  { label: "Nom", field: "nom", icon: User, type: "text" },
                  { label: "Localisation", field: "location", icon: MapPin, type: "text" },
                  { label: "Niveau de Surf", field: "surf_level", icon: Waves, isSelect: true },
                ].map((item) => {
                  const Icon = item.icon;
                  const fieldValue = currentData[item.field as keyof UserProfile];
                  return (
                    <div key={item.field} className="flex items-center gap-4">
                      <Icon size={16} className="text-gray-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                        <p className="text-sm font-medium text-gray-500">{item.label}</p>
                        {isEditing ? (
                          item.isSelect ? (
                            <select
                              value={fieldValue}
                              onChange={(e) => handleInputChange(item.field as keyof UserProfile, e.target.value)}
                              className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-48 mt-1 sm:mt-0"
                            >
                              <option value="Débutant">Débutant</option>
                              <option value="Intermédiaire">Intermédiaire</option>
                              <option value="Avancé">Avancé</option>
                              <option value="Expert">Expert</option>
                            </select>
                          ) : (
                            <input
                              type={item.type}
                              autoComplete={item.field === "password" ? "new-password" : "off"}
                              placeholder={item.field === "password" ? "Laisser vide pour ne pas changer" : ""}
                              value={fieldValue}
                              onChange={(e) => handleInputChange(item.field as keyof UserProfile, e.target.value)}
                              className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-48 mt-1 sm:mt-0"
                            />
                          )
                        ) : (
                          <p className="font-semibold text-gray-800 truncate">
                            {item.field === "password" ? "••••••" : fieldValue}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Favorites */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-800 flex gap-2 items-center">
                <Star size={20} className="text-yellow-400" /> Mes favoris
              </h2>
              <ul className="mt-4 space-y-3">
                {favorites.length > 0 ? (
                  favorites.map((fav) => {
                    const isMarkedForRemoval = removedFavoriteIds.includes(fav.api_place_id);
                    return (
                      <li
                        key={fav.api_place_id}
                        className={`flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-inner transition-opacity ${
                          isMarkedForRemoval ? "opacity-50" : "opacity-100"
                        }`}
                      >
                        <span
                          className={`font-medium capitalize ${
                            isMarkedForRemoval ? "text-gray-400 line-through" : "text-gray-800"
                          }`}
                        >
                          {fav.name}
                        </span>
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => toggleFavoriteRemoval(fav)}
                            className="text-gray-400 flex items-center justify-center w-8 h-8 p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <Star
                              size={18}
                              className={`transition-colors ${
                                isMarkedForRemoval ? "text-gray-400" : "text-yellow-400 fill-yellow-400"
                              }`}
                            />
                          </button>
                        ) : (
                          <Star size={18} className="text-yellow-400 fill-yellow-400" />
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="text-gray-500 text-sm italic p-3 bg-white rounded-lg border border-gray-100">
                    Vous n'avez pas encore de spots favoris.
                  </li>
                )}
              </ul>
            </div>

            {/* Editing buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#00B4D8] text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#0077B6] transition-colors"
                >
                  <Save size={16} />
                  Sauvegarder
                </button>
                <button
                  type="button"
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
      </form>

      <div className="p-4 pb-15 md:p-5 text-center text-sm text-gray-500 border-t border-gray-200">
        Bonne session ! 🤙
      </div>
    </MainLayout>
  );
}
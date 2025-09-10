"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, MapPin, Waves, Edit3, Save, X, Mail, Star } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useRouter } from "next/navigation";

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // ✅ E estado ahora es un array de objetos FavoriteSpot
  const [user, setUser] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<FavoriteSpot[]>([]);
  const [editedFavorites, setEditedFavorites] = useState<FavoriteSpot[]>([]);
  const [removedFavoriteIds, setRemovedFavoriteIds] = useState<string[]>([]);

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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok)
          throw new Error("Erreur lors du chargement du profil");
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
  // Fetch user profile on component mount
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

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
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

  // Fetch user favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
        const res = await fetch(`${baseUrl}/api/favorites`);
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
          setEditedFavorites(data); // Initialize edited favorites
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
    fetchFavorites();
  }, []);

  // Toggle favorite removal in editing mode (no API call yet)
  const toggleFavoriteRemoval = (spot: FavoriteSpot) => {
    if (!spot.api_place_id) return;

    setRemovedFavoriteIds((prev) => {
      const isCurrentlyRemoved = prev.includes(spot.api_place_id);
      if (isCurrentlyRemoved) {
        // Re-add to favorites if it was marked for removal
        return prev.filter((id) => id !== spot.api_place_id);
      } else {
        // Mark for removal
        return [...prev, spot.api_place_id];
      }
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedFavorites([...favorites]); // Reset edited favorites
    setRemovedFavoriteIds([]); // Reset removed favorites
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editedProfile) {
      console.error("Vous devez être connecté pour sauvegarder votre profil.");
      return;
    }

    try {
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
      const res = await fetch(`${baseUrl}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // ⚠️ tu utilisais "token" au lieu de "accessToken"
        },
        body: JSON.stringify({
          ...editedProfile,
          removedFavorites: removedFavoriteIds, // si tu veux aussi envoyer les favoris supprimés
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditedProfile(updatedUser);
        setFavorites((prev) =>
          prev.filter((fav) => !removedFavoriteIds.includes(fav.api_place_id))
        );
        setRemovedFavoriteIds([]);
        setIsEditing(false);
        console.log("Profil mis à jour avec succès !");
      } else {
        const errorData = await res.json();
        console.error(errorData.error || "Échec de la mise à jour du profil.");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil:", error);
    }
  };

  const handleCancel = () => {
    setEditedProfile(user);
    setEditedFavorites([...favorites]); // Reset to original favorites
    setRemovedFavoriteIds([]); // Reset removed favorites
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => (prev ? { ...prev, [field]: value } : null));
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
    new Intl.DateTimeFormat("fr-FR", options).format(currentDate).slice(1);

  if (loading || !currentData)
    return (
      <MainLayout>
        <div className="mt-20 text-center w-full h-24 text-black">
          Chargement...
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      {/* Form wrapper pour résoudre le warning du password field */}
      <form onSubmit={(e) => e.preventDefault()}>
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
          <div className="space-y-6 md:border-l md:border-gray-200 md:pl-8">
            {/* Profil Form */}
            <h2 className="text-xl font-semibold text-gray-800 flex md:justify-center gap-2">
              <User size={20} className="text-[#00B4D8]" /> Profil
            </h2>
            <div className="bg-gray-50 rounded-lg p-5 shadow-inner space-y-6">
              <div className="flex flex-col space-y-4 md:space-y-6">
                {[
                  { label: "Nom d'utilisateur", field: "username" },
                  { label: "Mot de passe", field: "password" },
                  { label: "Email", field: "email" },
                  { label: "Prénom", field: "prenom" },
                  { label: "Nom", field: "nom" },
                  { label: "Localisation", field: "location" },
                  { label: "Niveau de Surf", field: "surf_level" },
                ].map((item) => (
                  <div key={item.field} className="flex items-center gap-4">
                    {item.field === "email" ? (
                      <Mail size={16} className="text-gray-600 flex-shrink-0" />
                    ) : item.field === "localisation" ? (
                      <MapPin
                        size={16}
                        className="text-gray-600 flex-shrink-0"
                      />
                    ) : item.field === "surf" ? (
                      <Waves
                        size={16}
                        className="text-gray-600 flex-shrink-0"
                      />
                    ) : (
                      <User size={16} className="text-gray-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center">
                      <p className="text-sm font-medium text-gray-500">
                        {item.label}
                      </p>
                      {isEditing ? (
                        item.field === "surf" ? (
                          <select
                            value={currentData[item.field as keyof UserProfile]}
                            onChange={(e) =>
                              handleInputChange(
                                item.field as keyof UserProfile,
                                e.target.value
                              )
                            }
                            className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-48 mt-1 sm:mt-0"
                          >
                            <option value="Débutant">Débutant</option>
                            <option value="Intermédiaire">Intermédiaire</option>
                            <option value="Avancé">Avancé</option>
                            <option value="Expert">Expert</option>
                          </select>
                        ) : (
                          <input
                            type={
                              item.field === "password" ? "password" : "text"
                            }
                            autoComplete={
                              item.field === "password"
                                ? "current-password"
                                : "off"
                            }
                            value={currentData[item.field as keyof UserProfile]}
                            onChange={(e) =>
                              handleInputChange(
                                item.field as keyof UserProfile,
                                e.target.value
                              )
                            }
                            className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-full sm:w-48 mt-1 sm:mt-0"
                          />
                        )
                      ) : (
                        <p className="font-semibold text-gray-800 truncate">
                          {item.field === "password"
                            ? "••••••"
                            : currentData[item.field as keyof UserProfile]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-800 flex gap-2 items-center">
                <Star size={20} className="text-yellow-400" /> Mes favoris
              </h2>
              <ul className="mt-4 space-y-3">
                {favorites.map((fav) => {
                  const isMarkedForRemoval = removedFavoriteIds.includes(
                    fav.api_place_id
                  );

                  return (
                    <li
                      key={fav.api_place_id}
                      className={`flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-inner transition-opacity ${
                        isMarkedForRemoval ? "opacity-50" : "opacity-100"
                      }`}
                    >
                      <span
                        className={`font-medium capitalize ${
                          isMarkedForRemoval
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
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
                              isMarkedForRemoval
                                ? "text-gray-400"
                                : "text-yellow-400 fill-yellow-400"
                            }`}
                          />
                        </button>
                      ) : (
                        <Star
                          size={18}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Editing buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleSave}
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

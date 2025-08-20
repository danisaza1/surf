'use client';
// app/profile/page.tsx
import Image from "next/image";
import { User, MapPin, Waves, Edit3, Save, X, Mail, Phone, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
    firstName: "Albert",
    lastName: "BOSS",
    location: "Promenade des Anglais, Nice",
    surfLevel: "Intermédiaire",
    phone: "+33 6 12 34 56 78"
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const bestSpots = ["Hossegor", "Lacanau", "Biarritz", "Nice"];

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
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentData = isEditing ? editedProfile : profile;

  return (
    <div className="min-h-screen bg-[url('/surfbg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative flex items-center justify-center p-4">
      {/* Overlay noir */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-xl min-h-[90vh] flex flex-col z-10 relative">
        
        {/* Header avec z-index pour s'assurer qu'il apparaît */}
        <div className="relative z-20">
          <Header />
        </div>

        <div className="flex-1 p-6 space-y-8">
          {/* Section de Bienvenue */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-[#0077B6]">
                Bienvenue, {currentData.firstName} !
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Lundi, Août 19 - 2025
              </p>
            </div>
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src="/profile.png"
                alt="Profile"
                fill
                className="rounded-full border-4 border-[#00B4D8] shadow-lg object-cover"
              />
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="absolute -bottom-1 -right-1 bg-[#00B4D8] text-white p-1.5 rounded-full shadow-lg hover:bg-[#0077B6] transition-colors"
                >
                  <Edit3 size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Section du Profil */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User size={20} className="text-[#00B4D8]" /> Profil
            </h2>
            <div className="bg-gray-50 rounded-lg p-5 shadow-inner space-y-6">
              
              {/* Username */}
              <div className="flex items-center gap-4">
                <User size={16} className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Nom d'utilisateur</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-32"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">{currentData.username}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full ml-0.5"></div>
                </div>
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Mot de passe</p>
                  {isEditing ? (
                    <input
                      type="password"
                      value={currentData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-32"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">••••••</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <Mail size={16} className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-40 truncate"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800 truncate">{currentData.email}</p>
                  )}
                </div>
              </div>

              {/* First Name */}
              <div className="flex items-center gap-4">
                <User size={16} className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Prénom</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-32"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">{currentData.firstName}</p>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div className="flex items-center gap-4">
                <User size={16} className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Nom</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-32"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">{currentData.lastName}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <Phone size={16} className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Téléphone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-40"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800 text-sm">{currentData.phone}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <MapPin size={16} className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Localisation</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8] w-48"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800 truncate">{currentData.location}</p>
                  )}
                </div>
              </div>

              {/* Surf Level */}
              <div className="flex items-center gap-4">
                <Waves size={16} className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Niveau de Surf</p>
                  {isEditing ? (
                    <select
                      value={currentData.surfLevel}
                      onChange={(e) => handleInputChange('surfLevel', e.target.value)}
                      className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00B4D8]"
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

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 mt-4">
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

        {/* Footer & Bouton de déconnexion */}
        <div className="w-full mt-auto relative z-20">
          <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
            Bonne session ! 🤙
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
'use client';

import { LogOut, User, MapPin, Waves, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import { useState, useEffect } from 'react';
import Image from "next/image";

// Interface adaptée
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = '/login'; // Rediriger vers la page de login
  }

useEffect(() => {
  async function fetchProfile() {
    const token = localStorage.getItem("accessToken");
    console.log('Test du Token:', token);
    
    if (!token) {
      console.error('No access token found');
      setLoading(false);
      return;
    }

    try {
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
      
      // CORRECTION : Utiliser /profile au lieu de /latest-user
      const response = await fetch(`${baseUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(` pas okHTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      console.log('Données utilisateur:', userData);
      
      // CORRECTION : /profile retourne directement l'objet user, pas un tableau
      setUser(userData); // Pas besoin de userData[0].user
      
    } catch (error) {
      console.error(' Erreur du catch :', error);
      
      // Si erreur 401 (token invalide), rediriger vers login
      // if (error.message.includes('401')) {
      //   localStorage.removeItem("accessToken");
      //   // router.push('/login'); // Si vous avez useRouter
      // }
    } finally {
      setLoading(false);
    }
  }

  fetchProfile();
}, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <div>Erreur lors du chargement du profil</div>;
  }

  const bestSpots = ["Hossegor", "Lacanau", "Biarritz", "Nice"];

  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long'};
  const today =
    new Intl.DateTimeFormat('fr-FR', options).format(currentDate).charAt(0).toUpperCase() +
    new Intl.DateTimeFormat('fr-FR', options).format(currentDate).slice(1);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row flex-1 p-6 space-y-8 md:space-y-0 md:space-x-8">
        {/* Colonne de gauche : Profil */}
        <div className="md:w-1/2 md:border-r border-gray-200 md:pr-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-30">
            <div>
              <h1 className="text-3xl text-[#0077B6]">
                Bienvenue, {user.utilisateur} 
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {today}, {currentDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <LogOut className="text-gray-600 flex-shrink-0" onClick={handleLogout}/>
            </div>
            </div>
          </div>

          {/* Infos utilisateur */}
          <div className="space-y-4 mt-8">
            <div className="flex flex-row items-center gap-x-4 justify-center text-center">
              
           
            <h2 className="text-xl text-gray-800 flex justify-center gap-2">
              <User size={20} className="text-[#00B4D8]" /> Profil
            </h2>
            <Image
                src="/profile.jpg"
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full border-4 border-[#00B4D8] shadow-lg"
              />
             </div>
            <div className="bg-amber-50 rounded-lg p-5 shadow-inner space-y-4">
              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-gray-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Localisation</p>
                  <p className="text-gray-800">{user.adresse}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Waves size={20} className="text-gray-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Niveau de Surf</p>
                  <p className="text-gray-800">{user.surf}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="md:w-1/2 md:pl-4">
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
            <p className="text-center">Comment lire des prévisions de surf ?</p>
            <a
              href="guide"
              className="ml-1 text-gray-800 underline md:no-underline md:hover:underline"
            >
              Consultez notre guide
            </a>
          </div>
        </div>
      </div>

     
      
      <div className="p-4 pb-15 md:p-5 text-center text-sm text-gray-500 border-t border-gray-200">
        Bonne session ! 🤙
      </div>
    </MainLayout>
  );
}
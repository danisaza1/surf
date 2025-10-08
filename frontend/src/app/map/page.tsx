"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import MainLayout from "@/components/MainLayout";
import { useEffect, useState } from "react";

// ⬇️ Import dinámico SIN SSR
const SurfMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface UserProfile {
  username: string;
}

export default function SurfMapPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const currentDate = new Date();
  const today = new Intl.DateTimeFormat("fr-FR", { weekday: "long" })
    .format(currentDate)
    .replace(/^./, (c) => c.toUpperCase());

  useEffect(() => {
    if (typeof window === "undefined") return; // seguridad extra

    const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;

    async function fetchData() {
      const res = await fetch(`${baseUrl}/api/geocode?place=Hossegor`);
      const data = await res.json();
      console.log(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function fetchProfile() {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;

      try {
        const response = await fetch(`${baseUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  return (
    <MainLayout>
      <main className="flex-1 p-6 space-y-8 md:pb-0 pb-15">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-[#0077B6] md:text-4xl lg:text-5xl">
              Bienvenue,
            </h1>
            <p className="text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
              {user?.username} !
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {today}, {currentDate.toLocaleDateString()}
            </p>
          </div>
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src="/profile.jpg"
              alt="Profile"
              fill
              className="rounded-full border-4 border-[#00B4D8] shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Aquí va el mapa dinámico */}
        <SurfMap />

        <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-200 pb-8">
          Bonne session ! 🤙
        </div>
      </main>
    </MainLayout>
  );
}

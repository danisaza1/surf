// components/Header.tsx
"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // 👈 Importa Image
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isProfilePage = pathname === "/profil";

  return (
<header className="w-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white py-4">
      <div className="flex items-center justify-between px-4">
        
        {/* ⬇️ Aquí va tu icono a la izquierda */}
        <div className="w-1/3">
          <Image 
            src="/icon.png" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="object-contain"
          />
        </div>

        {/* Nom de l'application au centre */}
        <h1 className="text-xl font-bold text-center">Waveo</h1>

        {/* Bouton de déconnexion à droite */}
        <div className="w-1/3 flex justify-end">
          {isProfilePage ? (
            <Link href="/" className="flex items-center text-sm font-medium transition-colors hover:text-red-300">
              <LogOut size={20} className="mr-1" />
              Se déconnecter
            </Link>
          ) : (
            <div className="w-[125px]"></div>
          )}
        </div>
      </div>
    </header>
  );
}

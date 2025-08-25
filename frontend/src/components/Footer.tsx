// components/Footer.tsx
import { Home, User, Search, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="w-full
                     /* Desktop: normal footer inside card */
                     md:bg-gradient-to-r md:from-[#0077B6] md:to-[#00B4D8] 
                     md:text-white md:p-4 md:static
                     /* Mobile: floating footer */
                     fixed -bottom-2 left-0 right-0
                     bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white
                     mb-2 rounded-lg shadow-lg px-4 py-3
                     md:mx-0 md:mb-0 md:rounded-none md:shadow-none"
    >
      <nav>
        <ul className="flex justify-around items-center">
          <li className="flex flex-col items-center">
            <Link
              href="/accueil"
              className="flex flex-col items-center text-sm transition-colors hover:text-[#00B4D8]"
            >
              <Home size={24} />
              <span className="mt-1">Accueil</span>
            </Link>
          </li>
          <li className="flex flex-col items-center">
            <Link
              href="/profil"
              className="flex flex-col items-center text-sm transition-colors hover:text-[#00B4D8]"
            >
              <User size={24} />
              <span className="mt-1">Profil</span>
            </Link>
          </li>
          <li className="flex flex-col items-center">
            <Link
              href="/chercher-spot"
              className="flex flex-col items-center text-sm transition-colors hover:text-[#00B4D8]"
            >
              <Search size={24} />
              <span className="mt-1">Rechercher</span>
            </Link>
          </li>
          <li className="flex flex-col items-center">
            <Link
              href="/map"
              className="flex flex-col items-center text-sm transition-colors hover:text-[#00B4D8]"
            >
              <MapPin size={24} />
              <span className="mt-1">Carte</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

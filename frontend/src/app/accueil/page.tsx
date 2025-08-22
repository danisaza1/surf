"use client";

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [showPage, setShowPage] = useState(false);

  // Détection du swipe
  const handlers = useSwipeable({
    onSwipedLeft: () => setShowPage(true),   // swipe vers la gauche → montre page
    onSwipedRight: () => setShowPage(false), // swipe vers la droite → ferme page
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>

      {/* Conteneur principal avec détection swipe */}
      <div {...handlers} className="relative overflow-hidden h-screen">
        {/* PAGE D'ACCUEIL */}
        <div className="h-full bg-[url('/surfbg.jpg')] bg-cover bg-center relative flex items-center justify-center">
          {/* Overlay noir */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Contenu centré */}
          <div className="flex flex-col text-white relative z-10 p-4 sm:p-6 md:p-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl sm:text-5xl font-bold mb-8">Waveo</h1>
              <p className="text-lg sm:text-xl font-medium">
                Préparez votre session de surf parfaite.
              </p>
              <p className="text-sm mt-2 font-light">
                Découvrez les prévisions de vagues et la météo en temps réel
                pour une sécurité optimale.
              </p>
            </div>

            <div className="w-full flex flex-col space-y-4 max-w-sm mx-auto">
              <Link href="/login">
                <button className="w-full mt-8 bg-white text-[#0096C7] py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors">
                  Connectez-vous
                </button>
              </Link>
              <p className="text-center text-sm">
                Vous n'avez pas de compte ? <br />
                <Link href="/inscription" className="font-semibold underline">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* PAGE NOIRE "COUCOU" */}
        <div
          className={`fixed top-0 right-0 h-full w-full bg-black text-white flex items-center justify-center text-3xl font-bold transition-transform duration-500 ease-out
            ${showPage ? "translate-x-0" : "translate-x-full"}
          `}
        >
          Coucou 👋
        </div>
      </div>
    </>
  );
}

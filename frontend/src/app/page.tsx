"use client";

import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSwipeCube } from "../utils/useSwipeCube";
import Get from "@/components/get";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    w,
    setW,
    active,
    touchHandlers,
    getCubeStyle,
    getFaceStyle,
  } = useSwipeCube({
    onFaceChange: (faceIndex) => {
      if (faceIndex === 1) {
        // Start video when cube settles on the second face
        videoRef.current?.play().catch((e) => console.error("Video play failed:", e));
      } else {
        // Pause video when cube returns to the front face
        videoRef.current?.pause();
      }
    },
    animationDuration: 350,
    velocityThreshold: 0.05,
  });

  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [setW]);

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>

      {/* Perspective + gestion tactile */}
      <div
        className="relative h-screen [perspective:1000px] touch-pan-y"
        {...touchHandlers}
      >
        {/* CUBE */}
        <div style={getCubeStyle()}>
          {/* FACE AVANT : ta page d'accueil */}
          <div style={getFaceStyle('front')}>
            <div className="h-full w-full bg-[url('/surfbg.jpg')] bg-cover bg-center relative flex items-center justify-center">
              {/* Overlay noir */}
              <div className="absolute inset-0 bg-black/50" />
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
                    Vous n&apos;avez pas de compte ? <br />
                    <Link href="/inscription" className="font-semibold underline">
                      S&apos;inscrire
                    </Link>
                  </p>

         <Get />

          <div>coucou</div>
                </div>
              </div>
            </div>
          </div>
          {/* FACE DROITE : Vidéo */}
          <div style={getFaceStyle('right')}>
            <div className="h-full w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
              <video
                ref={videoRef}
                loop
                muted
                playsInline
                className="absolute w-full h-full object-cover"
              >
                <source src="/teaser.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <p className="text-xl sm:text-2xl font-bold text-white z-10">
                  Discover Waveo
                </p>
              </div>
            </div>
          </div>


        {/* FACE DROITE : Vidéo */}
          <div style={getFaceStyle('right')}>
            <div className="h-full w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
              <video
                ref={videoRef}
                loop
                muted
                playsInline
                className="absolute w-full h-full object-cover"
              >
                <source src="/teaser.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <p className="text-xl sm:text-2xl font-bold text-white z-10">
                  encore et encore
                </p>
              </div>
            </div>
          </div>

        </div>


        

        {/* Indice visuel (optionnel) */}
        <div className="absolute bottom-4 right-4 text-white/70 text-sm select-none">
          ↤ swipe
        </div>
      </div>
    </>
  );
}
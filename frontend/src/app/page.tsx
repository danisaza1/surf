"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  // largeur du viewport (sert pour la profondeur du cube)
  const [w, setW] = useState(0);

  // angle courant du cube (0° = accueil, -90° = coucou)
  const [angle, setAngle] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [active, setActive] = useState<0 | 1>(0); // face visible (0: accueil, 1: coucou)

  // ref to control the video element
  const videoRef = useRef<HTMLVideoElement>(null);

  // refs pour calculer la vélocité du swipe
  const startX = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /** Lance une animation vers 0° ou -90° */
  const settleTo = (target: -90 | 0) => {
    setAnimating(true);
    setAngle((prev) => prev); // déclenche transition CSS
    const dur = 350;
    setTimeout(() => {
      setAnimating(false);
      setAngle(target);
      setActive(target === -90 ? 1 : 0);
      if (target === -90) {
        // Start video when cube settles on the second face
        videoRef.current?.play().catch((e) => console.error("Video play failed:", e));
      } else {
        // Pause video when cube returns to the front face
        videoRef.current?.pause();
      }
    }, dur);
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (animating) return;
    dragging.current = true;
    startX.current = e.touches[0].clientX;
    lastX.current = startX.current;
    lastT.current = performance.now();
    velocity.current = 0;
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!dragging.current || animating || w === 0) return;
    const x = e.touches[0].clientX;
    const dx = x - startX.current;
    const now = performance.now();
    const dt = Math.max(1, now - lastT.current);
    velocity.current = (x - lastX.current) / dt; // px/ms
    lastX.current = x;
    lastT.current = now;
    // progression en fonction du sens et de la face active
    let progress: number;
    if (active === 0) {
      // on part de 0° et on va vers -90° avec un swipe gauche (dx négatif)
      progress = Math.min(1, Math.max(0, -dx / w));
      setAngle(-progress * 90);
    } else {
      // on part de -90° et on revient à 0° avec swipe droit (dx positif)
      progress = Math.min(1, Math.max(0, dx / w));
      setAngle(-90 + progress * 90);
    }
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (!dragging.current || animating) return;
    dragging.current = false;
    // seuil : soit plus de 50% du chemin, soit une vitesse suffisante
    const fast = Math.abs(velocity.current) > 0.8 / 16; // ~0.05 px/ms ≈ 800px/s
    if (active === 0) {
      const openedEnough = angle < -45;
      const flung = velocity.current < -0.05; // vers la gauche
      if (openedEnough || flung) settleTo(-90);
      else settleTo(0);
    } else {
      const closedEnough = angle > -45;
      const flung = velocity.current > 0.05; // vers la droite
      if (closedEnough || flung) settleTo(0);
      else settleTo(-90);
    }
  };

  // styles du cube
  const duration = animating ? 350 : 0; // ms (quand on relâche)
  const cubeStyle: React.CSSProperties = {
    transformStyle: "preserve-3d",
    transform: `translateZ(-${w / 2}px) rotateY(${angle}deg)`,
    transition: duration ? `transform ${duration}ms cubic-bezier(.22,.61,.36,1)` : undefined,
    width: w || "100vw",
    height: "100vh",
    position: "relative",
  };
  const faceCommon: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

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
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* CUBE */}
        <div style={cubeStyle}>
          {/* FACE AVANT : ta page d'accueil */}
          <div
            style={{
              ...faceCommon,
              transform: `translateZ(${w / 2}px)`,
            }}
          >
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
                </div>
              </div>
            </div>
          </div>
          {/* FACE DROITE : Vidéo */}
          <div
            style={{
              ...faceCommon,
              transform: `rotateY(90deg) translateZ(${w / 2}px)`,
            }}
          >
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
        </div>
        {/* Indice visuel (optionnel) */}
        <div className="absolute bottom-4 right-4 text-white/70 text-sm select-none">
          ↤ swipe
        </div>
      </div>
    </>
  );
}
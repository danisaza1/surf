"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SwipeHandler() {
  const router = useRouter();
  const [showSwipeZone, setShowSwipeZone] = useState(false);

  useEffect(() => {
    // Manipuler l'historique pour empêcher le retour
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Surcharger pushState
    window.history.pushState = function(state, title, url) {
      originalPushState.call(window.history, state, title, url);
      // Ajouter immédiatement un état pour empêcher le retour
      setTimeout(() => {
        originalPushState.call(window.history, { preventBack: true }, "", window.location.href);
      }, 0);
    };

    // Ajouter un état initial pour empêcher le retour
    window.history.pushState({ preventBack: true }, "", window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      // Toujours rester sur la même page
      window.history.pushState({ preventBack: true }, "", window.location.href);
      e.preventDefault();
      e.stopPropagation();
    };

    let startX = 0;
    let startY = 0;
    let isValidSwipe = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isValidSwipe = false;

      // Afficher la zone de swipe si on commence près du bord droit
      if (startX > window.innerWidth - 100) {
        setShowSwipeZone(true);
      }

      // Bloquer complètement les touches qui commencent du bord gauche
      if (startX < 50) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // Si on est dans une zone de swipe valide (pas le bord gauche)
      if (startX > 50) {
        // Swipe vers la droite détecté
        if (deltaX > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 2) {
          isValidSwipe = true;
          setShowSwipeZone(true);
        }
      } else {
        // Bloquer tous les mouvements qui commencent du bord gauche
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;

      setShowSwipeZone(false);

      // Swipe valide vers la droite (pas depuis le bord gauche)
      if (
        startX > 50 && 
        deltaX > 100 && 
        Math.abs(deltaX) > Math.abs(deltaY) * 1.5 &&
        isValidSwipe
      ) {
        e.preventDefault();
        router.push("/previsions");
      }
    };

    // Désactiver complètement le swipe back avec CSS
    document.body.style.cssText += `
      overscroll-behavior-x: none !important;
      -webkit-overflow-scrolling: auto !important;
      touch-action: pan-y !important;
    `;

    // Ajouter les event listeners avec capture
    window.addEventListener('popstate', handlePopState, { capture: true });
    document.addEventListener('touchstart', handleTouchStart, { 
      passive: false, 
      capture: true 
    });
    document.addEventListener('touchmove', handleTouchMove, { 
      passive: false, 
      capture: true 
    });
    document.addEventListener('touchend', handleTouchEnd, { 
      passive: false, 
      capture: true 
    });

    return () => {
      // Restaurer les fonctions d'origine
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [router]);

  return (
    <>
      {/* Zone visuelle pour indiquer le swipe */}
      {showSwipeZone && (
        <div className="fixed top-0 right-0 h-full w-20 bg-white/20 backdrop-blur-sm border-l-2 border-white/40 z-50 flex items-center justify-center transition-all duration-200">
          <div className="text-white text-center">
            <div className="text-2xl mb-2">👆</div>
            <div className="text-xs">Swipe</div>
          </div>
        </div>
      )}
    </>
  );
}
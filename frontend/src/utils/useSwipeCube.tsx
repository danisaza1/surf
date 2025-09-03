// utils/useSwipeCube.ts
import { useRef, useState, useCallback } from "react";

interface UseSwipeCubeOptions {
  onFaceChange?: (faceIndex: 0 | 1) => void;
  animationDuration?: number;
  velocityThreshold?: number;
}

export function useSwipeCube(options: UseSwipeCubeOptions = {}) {
  const {
    onFaceChange,
    animationDuration = 350,
    velocityThreshold = 0.05
  } = options;

  // État du cube
  const [w, setW] = useState(0);
  const [angle, setAngle] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [active, setActive] = useState<0 | 1>(0);

  // Refs pour le tracking du swipe
  const startX = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);

  /** Lance une animation vers 0° ou -90° */
  const settleTo = useCallback((target: -90 | 0) => {
    setAnimating(true);
    setAngle((prev) => prev); // déclenche transition CSS
    
    setTimeout(() => {
      setAnimating(false);
      setAngle(target);
      const newActive = target === -90 ? 1 : 0;
      setActive(newActive);
      onFaceChange?.(newActive);
    }, animationDuration);
  }, [animationDuration, onFaceChange]);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    if (animating) return;
    dragging.current = true;
    startX.current = e.touches[0].clientX;
    lastX.current = startX.current;
    lastT.current = performance.now();
    velocity.current = 0;
  }, [animating]);

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
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
  }, [animating, w, active]);

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = useCallback(() => {
    if (!dragging.current || animating) return;
    dragging.current = false;
    
    if (active === 0) {
      const openedEnough = angle < -45;
      const flung = velocity.current < -velocityThreshold; // vers la gauche
      if (openedEnough || flung) settleTo(-90);
      else settleTo(0);
    } else {
      const closedEnough = angle > -45;
      const flung = velocity.current > velocityThreshold; // vers la droite
      if (closedEnough || flung) settleTo(0);
      else settleTo(-90);
    }
  }, [animating, active, angle, velocityThreshold, settleTo]);

  // Styles du cube
  const getCubeStyle = useCallback((): React.CSSProperties => ({
    transformStyle: "preserve-3d",
    transform: `translateZ(-${w / 2}px) rotateY(${angle}deg)`,
    transition: animating ? `transform ${animationDuration}ms cubic-bezier(.22,.61,.36,1)` : undefined,
    width: w || "100vw",
    height: "100vh",
    position: "relative",
  }), [w, angle, animating, animationDuration]);

  const getFaceStyle = useCallback((faceType: 'front' | 'right'): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      backfaceVisibility: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const transform = faceType === 'front' 
      ? `translateZ(${w / 2}px)`
      : `rotateY(90deg) translateZ(${w / 2}px)`;

    return {
      ...baseStyle,
      transform,
    };
  }, [w]);

  return {
    // État
    w,
    setW,
    angle,
    animating,
    active,
    
    // Handlers tactiles
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    
    // Fonctions utilitaires
    settleTo,
    getCubeStyle,
    getFaceStyle,
  };
}
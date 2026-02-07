"use client";

import { useEffect, useState } from "react";

const BASE_WIDTH = 380;
const MAX_WIDTH = 600;
const PADDING = 32;

export function useResizeScale() {
  const [scale, setScale] = useState(1);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function handleResize() {
      const availableWidth = window.innerWidth - PADDING;
      const effectiveWidth = Math.min(MAX_WIDTH, availableWidth);
      setScale(effectiveWidth / BASE_WIDTH);
    }

    handleResize();
    const fadeTimer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsReady(true));
    });
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(fadeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { scale, isReady };
}

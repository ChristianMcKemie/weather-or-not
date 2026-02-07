"use client";

import { useEffect, useRef } from "react";

const FADE_DELAY_MS = 5000;
const CLEAR_DELAY_MS = 5500;

export function useAutoDismissError(
  error: string | null,
  clearError: () => void
) {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!error) return;
    const fadeTimer = setTimeout(() => {
      toastRef.current?.classList.add("opacity-0");
    }, FADE_DELAY_MS);
    const clearTimer = setTimeout(clearError, CLEAR_DELAY_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(clearTimer);
    };
  }, [error, clearError]);

  return toastRef;
}

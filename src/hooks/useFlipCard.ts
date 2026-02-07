"use client";

import { useEffect, useRef, useState } from "react";

const FADE_MS = 300;

interface UseFlipCardOptions {
  loading: boolean;
  hasContent: boolean;
  /** When true, skip auto flip-in on load end (caller handles flip timing) */
  skipFlipInOnLoadEnd?: boolean;
}

interface UseFlipCardReturn {
  /** Whether the loader face is shown (loading or fading out) */
  showLoader: boolean;
  /** Whether the card is flipped to show content */
  flipIn: boolean;
  /** Manually control the flip state */
  setFlipIn: (value: boolean) => void;
  /** Opacity for loader content (spinner/text) - 0 when fading or flipping */
  loaderContentOpacity: number;
  /** Opacity for weather/content - 0 when fading out */
  contentOpacity: number;
}

export function useFlipCard({
  loading,
  hasContent,
  skipFlipInOnLoadEnd = false
}: UseFlipCardOptions): UseFlipCardReturn {
  const [loaderFadingOut, setLoaderFadingOut] = useState(false);
  const [flipIn, setFlipIn] = useState(false);
  const [weatherFadingOut, setWeatherFadingOut] = useState(false);
  const [loaderFadingIn, setLoaderFadingIn] = useState(true);
  const prevLoadingRef = useRef(loading);

  // Sequence: loader fades out, then flip runs (unless caller handles it)
  useEffect(() => {
    if (
      prevLoadingRef.current &&
      !loading &&
      hasContent &&
      !skipFlipInOnLoadEnd
    ) {
      queueMicrotask(() => {
        setWeatherFadingOut(false);
        setLoaderFadingOut(true);
      });
      const flipTimer = setTimeout(() => {
        prevLoadingRef.current = false;
        setLoaderFadingOut(false);
        setFlipIn(true);
      }, FADE_MS);
      return () => clearTimeout(flipTimer);
    }
    prevLoadingRef.current = loading;
  }, [loading, hasContent, skipFlipInOnLoadEnd]);

  // When loading starts: fade out content, then reset and fade in loader
  // Only flip to loader if we don't have content yet
  useEffect(() => {
    if (loading && flipIn && !hasContent) {
      queueMicrotask(() => setWeatherFadingOut(true));
      const resetTimer = setTimeout(() => {
        setFlipIn(false);
        setWeatherFadingOut(false);
        setLoaderFadingIn(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setLoaderFadingIn(true));
        });
      }, FADE_MS);
      return () => clearTimeout(resetTimer);
    }
  }, [loading, flipIn, hasContent]);

  const showLoader = loading || loaderFadingOut;

  const loaderContentOpacity =
    loaderFadingOut || flipIn ? 0 : loading && !loaderFadingIn ? 0 : 1;

  const contentOpacity = weatherFadingOut ? 0 : 1;

  return {
    showLoader,
    flipIn,
    setFlipIn,
    loaderContentOpacity,
    contentOpacity
  };
}

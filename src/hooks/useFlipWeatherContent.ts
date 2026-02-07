"use client";

import { useLayoutEffect, useState } from "react";
import { useFlipCard } from "@/hooks/useFlipCard";
import type { WeatherData } from "@/lib/weather";

interface UseFlipWeatherContentOptions {
  loading: boolean;
  weather: WeatherData | null;
}

export function useFlipWeatherContent({
  loading,
  weather
}: UseFlipWeatherContentOptions) {
  const [displayWeather, setDisplayWeather] = useState<WeatherData | null>(
    weather
  );
  const [frontContent, setFrontContent] = useState<WeatherData | null>(null);

  const {
    showLoader,
    flipIn,
    setFlipIn,
    loaderContentOpacity,
    contentOpacity
  } = useFlipCard({
    loading,
    hasContent: !!weather,
    skipFlipInOnLoadEnd: displayWeather !== null && weather !== displayWeather
  });

  useLayoutEffect(() => {
    if (weather !== displayWeather) {
      const showingBack = flipIn;
      if (displayWeather !== null && showingBack) {
        // Showing back, need to flip to front with new content
        setFrontContent(weather);
        setFlipIn(false);
        // Delay updating displayWeather until after flip completes
        const timer = setTimeout(() => {
          setDisplayWeather(weather);
          setFrontContent(null);
        }, 500);
        return () => clearTimeout(timer);
      } else if (displayWeather !== null && !showingBack) {
        // Showing front, need to flip to back with new content
        setDisplayWeather(weather);
        setFlipIn(true);
      } else {
        // Initial load
        queueMicrotask(() => setDisplayWeather(weather));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run when weather changes
  }, [weather]);

  return {
    displayWeather,
    frontContent,
    showLoader,
    flipIn,
    loaderContentOpacity,
    contentOpacity
  };
}

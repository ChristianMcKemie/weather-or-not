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
        setFrontContent(weather);
        setFlipIn(false);
        setDisplayWeather(weather);
      } else if (displayWeather !== null && !showingBack) {
        setDisplayWeather(weather);
        setFlipIn(true);
        setFrontContent(null);
      } else {
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

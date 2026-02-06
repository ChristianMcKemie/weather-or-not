"use client";

import { useEffect, useState } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { useFlipCard } from "@/hooks/useFlipCard";
import type { WeatherData } from "@/lib/weather";

interface FlipWeatherCardProps {
  loading: boolean;
  weather: WeatherData | null;
  unit: "celsius" | "fahrenheit";
}

export function FlipWeatherCard({
  loading,
  weather,
  unit
}: FlipWeatherCardProps) {
  const {
    showLoader,
    flipIn,
    setFlipIn,
    loaderContentOpacity,
    contentOpacity
  } = useFlipCard({
    loading,
    hasContent: !!weather
  });

  const [displayWeather, setDisplayWeather] = useState<WeatherData | null>(
    weather
  );

  useEffect(() => {
    // Only animate if we have content and it changed
    if (weather !== displayWeather) {
      if (flipIn) {
        // Refresh case: Flip to front (loader), update content halfway, flip back
        setFlipIn(false);
        const updateTimer = setTimeout(() => {
          setDisplayWeather(weather);
        }, 250);
        const flipBackTimer = setTimeout(() => {
          setFlipIn(true);
        }, 500);
        return () => {
          clearTimeout(updateTimer);
          clearTimeout(flipBackTimer);
        };
      } else {
        // Initial load or error state: Update content (defer to avoid sync setState in effect)
        queueMicrotask(() => setDisplayWeather(weather));
      }
    }
  }, [weather, displayWeather, flipIn, setFlipIn]);

  return (
    <div className="h-60 w-95 perspective-[1000px]">
      {/* Single card that flips - front = loader, back = weather */}
      <div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d"
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transform: flipIn ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: flipIn ? "transform 500ms ease-out" : "none"
          }}
        >
          {/* Front face - loader */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-md"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              pointerEvents: showLoader ? "auto" : "none"
            }}
          >
            <div
              className="flex flex-col items-center gap-4 transition-opacity duration-300 ease-in-out"
              style={{
                opacity: loaderContentOpacity
              }}
            >
              <div
                className="h-10 w-10 animate-spin rounded-full border-2 border-purple border-t-transparent"
                aria-hidden
              />
            </div>
          </div>

          {/* Back face - weather (background stays, only content fades) */}
          <div
            className="absolute inset-0 flex flex-col items-start rounded-2xl bg-white px-3 pt-3 pb-3 shadow-md"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              pointerEvents: showLoader ? "none" : "auto"
            }}
          >
            <div
              className="flex justify-between min-h-0 w-full flex-1 flex-col self-stretch overflow-auto transition-opacity duration-300 ease-in-out"
              style={{ opacity: contentOpacity }}
            >
              {displayWeather ? (
                <WeatherCard data={displayWeather} unit={unit} contentOnly />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

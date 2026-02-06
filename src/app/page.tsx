"use client";

import { useEffect, useRef, useState } from "react";
import { ZipSearch } from "@/components/ZipSearch";
import { FlipWeatherCard } from "@/components/FlipWeatherCard";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { useWeather } from "@/providers/WeatherProvider";

export default function Home() {
  const { weather, loading, error, clearError, unit, search, toggleUnit } =
    useWeather();
  const [scale, setScale] = useState(1);
  const [isReady, setIsReady] = useState(false);

  // Auto-dismiss toast after 5 seconds with fade out
  const toastRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!error) return;
    const fadeTimer = setTimeout(() => {
      toastRef.current?.classList.add("opacity-0");
    }, 5000);
    const clearTimer = setTimeout(() => {
      clearError();
    }, 5500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(clearTimer);
    };
  }, [error, clearError]);

  // Handle scaling based on window width
  useEffect(() => {
    function handleResize() {
      const BASE_WIDTH = 380;
      const availableWidth = window.innerWidth - 32;
      const effectiveWidth = Math.min(600, availableWidth);
      const newScale = effectiveWidth / BASE_WIDTH;
      setScale(newScale);
    }

    handleResize(); // Initial calculation
    // Fade in after scale is applied (next frame)
    const fadeTimer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsReady(true));
    });
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(fadeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-grey overflow-x-hidden">
      <main className="mx-auto flex w-full flex-col items-center px-4 py-8">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            // Add a bit of margin bottom because scale doesn't affect flow layout height
            marginBottom: `${(scale - 1) * 300}px`,
          }}
          className={`flex flex-col items-center gap-8 transition-opacity duration-500 ease-out ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative">
            <ZipSearch
              onSearch={search}
              isLoading={loading}
              searchError={!!error}
            />
            {error && (
              <div
                ref={toastRef}
                role="alert"
                className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-amber-50 px-2 py-1.5 text-xs text-amber-800 shadow-lg transition-opacity duration-500"
              >
                {error}
              </div>
            )}
          </div>

          {(loading || weather) && (
            <>
              <FlipWeatherCard
                loading={loading}
                weather={weather}
                unit={unit}
              />
              <TemperatureToggle unit={unit} onToggle={toggleUnit} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

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
  unit,
}: FlipWeatherCardProps) {
  const { showLoader, flipIn, loaderContentOpacity, contentOpacity } =
    useFlipCard({
      loading,
      hasContent: !!weather,
    });

  return (
    <div className="h-60 w-95 perspective-[1000px]">
      {/* Single card that flips - front = loader, back = weather */}
      <div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: flipIn ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: flipIn ? "transform 500ms ease-out" : "none",
          }}
        >
          {/* Front face - loader */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-md backface-hidden"
            style={{
              pointerEvents: showLoader ? "auto" : "none",
            }}
          >
            <div
              className="flex flex-col items-center gap-4 transition-opacity duration-300 ease-in-out"
              style={{
                opacity: loaderContentOpacity,
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
            className="absolute inset-0 flex flex-col items-start rounded-2xl bg-white px-3 pt-3 pb-3 shadow-md backface-hidden"
            style={{
              transform: "rotateY(180deg)",
              pointerEvents: showLoader ? "none" : "auto",
            }}
          >
            <div
              className="flex justify-between min-h-0 w-full flex-1 flex-col self-stretch overflow-auto transition-opacity duration-300 ease-in-out"
              style={{ opacity: contentOpacity }}
            >
              {weather ? (
                <WeatherCard data={weather} unit={unit} contentOnly />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

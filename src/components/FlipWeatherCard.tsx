"use client";

import { WeatherCard } from "@/components/WeatherCard";
import { useFlipWeatherContent } from "@/hooks/useFlipWeatherContent";
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
    displayWeather,
    frontContent,
    showLoader,
    flipIn,
    loaderContentOpacity,
    contentOpacity
  } = useFlipWeatherContent({ loading, weather });

  return (
    <div className="h-59 w-95 perspective-[1000px]">
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
            transition: "transform 500ms ease-out"
          }}
        >
          {/* Front face - loader or content (when flipping to show new) */}
          <div
            className="absolute inset-0 flex flex-col items-start rounded-2xl bg-white shadow-md"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              pointerEvents: showLoader && !frontContent ? "auto" : "none"
            }}
          >
            {frontContent ? (
              <div className="flex min-h-0 w-full flex-1 flex-col justify-between self-stretch overflow-auto px-3 pt-3 pb-3">
                <WeatherCard data={frontContent} unit={unit} contentOnly />
              </div>
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: loaderContentOpacity }}
              >
                <div
                  className="h-10 w-10 animate-spin rounded-full border-2 border-purple border-t-transparent"
                  aria-hidden
                />
              </div>
            )}
          </div>

          {/* Back face - weather */}
          <div
            className="absolute inset-0 flex flex-col items-start rounded-2xl bg-white px-3 pt-3 pb-3 shadow-md"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              pointerEvents: showLoader && !frontContent ? "none" : "auto"
            }}
          >
            <div
              className="flex min-h-0 w-full flex-1 flex-col justify-between self-stretch overflow-auto"
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

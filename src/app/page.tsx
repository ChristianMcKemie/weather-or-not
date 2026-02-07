"use client";

import { ZipSearch } from "@/components/ZipSearch";
import { FlipWeatherCard } from "@/components/FlipWeatherCard";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { useWeather } from "@/providers/WeatherProvider";
import { useResizeScale } from "@/hooks/useResizeScale";
import { useAutoDismissError } from "@/hooks/useAutoDismissError";

export default function Home() {
  const { weather, loading, error, clearError, unit, search, toggleUnit } =
    useWeather();
  const { scale, isReady } = useResizeScale();
  const toastRef = useAutoDismissError(error, clearError);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-grey overflow-x-hidden">
      <main className="mx-auto flex w-full flex-col items-center px-4 py-8">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            // Add a bit of margin bottom because scale doesn't affect flow layout height
            marginBottom: `${(scale - 1) * 300}px`
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
                className="absolute bottom-full left-1/2 z-10 mb-2 w-95 -translate-x-1/2 rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-800 shadow-lg transition-opacity duration-500"
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

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchWeatherByZip } from "@/lib/weather";
import type { WeatherData } from "@/lib/weather";

const HOUSTON_ZIP = "77001";

interface WeatherContextValue {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  unit: "celsius" | "fahrenheit";
  search: (zipCode: string) => void;
  toggleUnit: () => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("fahrenheit");
  const lastSearchedZipRef = useRef<string | null>(null);

  const loadWeather = useCallback(async (zipCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByZip(zipCode);
      if (data) {
        setWeather(data);
        setError(null);
      } else {
        setError(
          "Could not find weather for that ZIP code. Please try another."
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    lastSearchedZipRef.current = HOUSTON_ZIP;
    loadWeather(HOUSTON_ZIP);
  }, [loadWeather]);

  const search = useCallback(
    (zipCode: string) => {
      const normalizedZip = zipCode.trim().replace(/\D/g, "").slice(0, 5);
      const lastZip = lastSearchedZipRef.current
        ?.trim()
        .replace(/\D/g, "")
        .slice(0, 5);
      if (normalizedZip === lastZip) return;
      lastSearchedZipRef.current = zipCode.trim();
      loadWeather(zipCode);
    },
    [loadWeather]
  );

  const toggleUnit = useCallback(() => {
    setUnit((u) => (u === "celsius" ? "fahrenheit" : "celsius"));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: WeatherContextValue = {
    weather,
    loading,
    error,
    clearError,
    unit,
    search,
    toggleUnit,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}

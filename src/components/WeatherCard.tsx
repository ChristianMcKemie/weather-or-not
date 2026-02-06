"use client";

import { useEffect, useRef, useState } from "react";
import { WeatherIcon } from "@/lib/weather-icons";
import type { WeatherData } from "@/lib/weather";
import { DayForecastCard } from "@/components/DayForecastCard";

const FADE_MS = 250;

interface WeatherCardProps {
  data: WeatherData;
  unit: "celsius" | "fahrenheit";
  contentOnly?: boolean;
}

function toDisplayTemp(
  celsius: number,
  unit: "celsius" | "fahrenheit"
): number {
  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function WeatherCard({ data, unit, contentOnly }: WeatherCardProps) {
  const [displayUnit, setDisplayUnit] = useState(unit);
  const [isFading, setIsFading] = useState(false);
  const prevUnitRef = useRef(unit);

  useEffect(() => {
    if (prevUnitRef.current !== unit) {
      queueMicrotask(() => setIsFading(true));
      prevUnitRef.current = unit;
      const timer = setTimeout(() => {
        setDisplayUnit(unit);
        setIsFading(false);
      }, FADE_MS);
      return () => clearTimeout(timer);
    }
  }, [unit]);

  const temp = toDisplayTemp(data.current.temperature, displayUnit);

  const numbersClass =
    "transition-opacity duration-250 ease-in-out " +
    (isFading ? "opacity-0" : "opacity-100");

  const content = (
    <>
      {/* Location, temperature, and icon - icon container matches city + temp height */}
      <div className="grid grid-cols-[1fr_auto] items-stretch gap-4">
        <div className="flex flex-col gap-1">
          <p className="mb-0 ml-1.5 text-xs font-bold uppercase tracking-wide text-gray-700">
            {data.location.city}, {data.location.state}
          </p>
          <div className="flex items-start gap-1">
            <span
              className={`inline-block tabular-nums ml-1.5 text-[85px] font-[450] leading-none tracking-[3px] text-purple ${numbersClass}`}
            >
              {temp}
            </span>
            <span
              className={`self-start text-[48px] font-[450] leading-none text-purple ${numbersClass}`}
            >
              °{displayUnit === "fahrenheit" ? "F" : "C"}
            </span>
          </div>
        </div>
        <WeatherIcon
          code={data.current.weatherCode}
          className="h-26 w-26 text-purple"
          aria-hidden
        />
      </div>

      {/* 5-day forecast */}
      <div className="flex justify-center gap-3 overflow-x-auto">
        {data.forecast.map((day) => (
          <DayForecastCard
            key={day.date}
            day={day}
            displayUnit={displayUnit}
            numbersClass={numbersClass}
          />
        ))}
      </div>
    </>
  );

  if (contentOnly) {
    return content;
  }

  return (
    <div className="min-h-75 rounded-2xl bg-white p-6 shadow-sm">{content}</div>
  );
}

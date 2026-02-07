"use client";

import { WeatherIcon } from "@/lib/weather-icons";
import type { DailyForecast } from "@/lib/weather";

interface DayForecastCardProps {
  day: DailyForecast;
  displayUnit: "celsius" | "fahrenheit";
  numbersClass: string;
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

function formatDay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
}

export function DayForecastCard({
  day,
  displayUnit,
  numbersClass
}: DayForecastCardProps) {
  return (
    <div className="flex h-22.5 w-15 shrink-0 flex-col items-center justify-evenly gap-0.5 rounded-xl bg-day-card-bg p-1 ring-1 ring-gray-100">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden p-0.5">
        <WeatherIcon
          code={day.weatherCode}
          className="h-7 w-7 text-purple"
          aria-hidden
        />
      </div>
      <div className="flex items-start">
        <span
          className={`tabular-nums text-[24px] font-semibold leading-none tracking-[0.5px] text-black ${numbersClass}`}
        >
          {toDisplayTemp(day.tempMax, displayUnit)}
        </span>
        <span
          className={`self-start text-xs font-semibold leading-none text-black ${numbersClass}`}
        >
          °{displayUnit === "fahrenheit" ? "F" : "C"}
        </span>
      </div>
      <span className="text-sm font-medium leading-none text-gray-500">
        {formatDay(day.date)}
      </span>
    </div>
  );
}

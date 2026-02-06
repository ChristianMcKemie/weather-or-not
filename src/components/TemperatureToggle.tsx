"use client";

interface TemperatureToggleProps {
  unit: "celsius" | "fahrenheit";
  onToggle: () => void;
}

export function TemperatureToggle({ unit, onToggle }: TemperatureToggleProps) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span className="text-xs font-semibold leading-none tracking-0 text-gray-500">
        Fahrenheit
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={unit === "fahrenheit"}
        onClick={onToggle}
        className="relative h-6.25 w-10.5 rounded-full bg-toggle-bg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2"
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-purple transition-all ${
            unit === "fahrenheit" ? "left-0.75" : "left-5.75"
          }`}
        />
      </button>
      <span className="text-xs font-semibold leading-none tracking-0 text-gray-500">
        Celsius
      </span>
    </div>
  );
}

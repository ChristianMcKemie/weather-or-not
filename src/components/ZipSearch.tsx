"use client";

import { useState, FormEvent } from "react";
import { FiSearch } from "react-icons/fi";

// Valid US ZIP: 5 digits (12345) or ZIP+4 (12345-6789)
const US_ZIP_REGEX = /^\d{5}(-\d{4})?$/;

function isValidUSZip(value: string): boolean {
  const trimmed = value.trim();
  return US_ZIP_REGEX.test(trimmed);
}

// Only allow digits and hyphen in ZIP+4 format while typing
function formatZipInput(value: string): string {
  const digitsAndHyphen = value.replace(/[^\d-]/g, "");
  // Prevent multiple hyphens
  const parts = digitsAndHyphen.split("-");
  if (parts.length > 2) {
    return parts[0] + "-" + parts.slice(1).join("");
  }
  // If we have a hyphen, only allow 4 digits after it
  if (parts.length === 2 && parts[1].length > 4) {
    return parts[0] + "-" + parts[1].slice(0, 4);
  }
  // First part (before hyphen) max 5 digits
  if (parts[0].length > 5) {
    return parts[0].slice(0, 5) + (parts[1] ? "-" + parts[1] : "");
  }
  return digitsAndHyphen;
}

interface ZipSearchProps {
  onSearch: (zipCode: string) => void;
  isLoading: boolean;
  searchError?: boolean;
}

export function ZipSearch({
  onSearch,
  isLoading,
  searchError = false
}: ZipSearchProps) {
  const [zipCode, setZipCode] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatZipInput(e.target.value);
    setZipCode(formatted);
    setValidationError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError(null);

    const trimmed = zipCode.trim();
    if (!trimmed) {
      setValidationError("Please enter a ZIP code.");
      return;
    }
    if (!isValidUSZip(trimmed)) {
      setValidationError(
        "Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)."
      );
      return;
    }
    onSearch(trimmed);
  }

  const isValid = isValidUSZip(zipCode);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-1">
        <div
          className={`flex h-11.25 w-95 items-center gap-2 rounded-full bg-white p-1.5 shadow-md ${
            searchError ? "animate-shake" : ""
          }`}
        >
          <input
            type="text"
            inputMode="numeric"
            value={zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
            maxLength={10}
            className="h-8 min-w-0 flex-1 rounded-full border-0 bg-transparent px-4 text-gray-800 placeholder:text-sm placeholder:font-semibold placeholder:text-gray-500 transition-shadow duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2"
            disabled={isLoading}
            aria-invalid={!!validationError}
            aria-describedby={
              validationError ? "zip-validation-error" : undefined
            }
          />
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple text-white transition-shadow duration-200 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden
              />
            ) : (
              <FiSearch className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        {validationError && (
          <p id="zip-validation-error" className="px-4 text-sm text-amber-700">
            {validationError}
          </p>
        )}
      </div>
    </form>
  );
}

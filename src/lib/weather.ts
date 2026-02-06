/**
 * Weather API integration
 * Uses Zippopotam (free, no API key) for ZIP → location
 * Uses Open-Meteo (free, no API key) for weather data
 */

export interface LocationData {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

export interface WeatherData {
  location: LocationData;
  current: CurrentWeather;
  forecast: DailyForecast[];
}

// Zippopotam API response structure
interface ZippopotamPlace {
  "place name": string;
  longitude: string;
  latitude: string;
  state: string;
  "state abbreviation": string;
}

interface ZippopotamResponse {
  "post code": string;
  places: ZippopotamPlace[];
}

// Open-Meteo API response structure
interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

export async function fetchLocationFromZip(
  zipCode: string
): Promise<LocationData | null> {
  const cleanZip = zipCode.trim().replace(/\D/g, "").slice(0, 5);
  if (cleanZip.length < 5) return null;

  try {
    const res = await fetch(`https://api.zippopotam.us/us/${cleanZip}`);
    if (!res.ok) return null;

    const data: ZippopotamResponse = await res.json();
    const place = data.places?.[0];
    if (!place) return null;

    return {
      city: place["place name"],
      state: place["state abbreviation"],
      latitude: parseFloat(place.latitude),
      longitude: parseFloat(place.longitude)
    };
  } catch {
    return null;
  }
}

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<Omit<WeatherData, "location"> | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", lat.toString());
    url.searchParams.set("longitude", lon.toString());
    url.searchParams.set("current", "temperature_2m,weather_code");
    url.searchParams.set(
      "daily",
      "temperature_2m_max,temperature_2m_min,weather_code"
    );
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", "5");

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const data: OpenMeteoResponse = await res.json();

    const forecast: DailyForecast[] = data.daily.time
      .slice(0, 5)
      .map((date, i) => ({
        date,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        weatherCode: data.daily.weather_code[i]
      }));

    return {
      current: {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code
      },
      forecast
    };
  } catch {
    return null;
  }
}

export async function fetchWeatherByZip(
  zipCode: string
): Promise<WeatherData | null> {
  const location = await fetchLocationFromZip(zipCode);
  if (!location) return null;

  const weather = await fetchWeather(location.latitude, location.longitude);
  if (!weather) return null;

  return {
    location,
    ...weather
  };
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

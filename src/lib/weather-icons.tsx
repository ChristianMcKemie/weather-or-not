/**
 * Maps Open-Meteo WMO weather codes to Lucide Icons
 * https://open-meteo.com/en/docs#weathervariables
 * https://lucide.dev/icons/
 */
import {
  LuSun,
  LuCloudSun,
  LuCloudy,
  LuCloudFog,
  LuCloudDrizzle,
  LuCloudRain,
  LuCloudSnow,
  LuSnowflake,
  LuCloudLightning,
} from "react-icons/lu";
import type { IconType } from "react-icons";

const weatherIconMap: Record<number, IconType> = {
  0: LuSun,
  1: LuCloudSun,
  2: LuCloudSun,
  3: LuCloudy,
  45: LuCloudFog,
  48: LuCloudFog,
  51: LuCloudDrizzle,
  53: LuCloudDrizzle,
  55: LuCloudDrizzle,
  56: LuCloudDrizzle,
  57: LuCloudDrizzle,
  61: LuCloudRain,
  63: LuCloudRain,
  65: LuCloudRain,
  66: LuCloudRain,
  67: LuCloudRain,
  71: LuSnowflake,
  73: LuSnowflake,
  75: LuSnowflake,
  77: LuCloudSnow,
  80: LuCloudRain,
  81: LuCloudRain,
  82: LuCloudRain,
  85: LuSnowflake,
  86: LuSnowflake,
  95: LuCloudLightning,
  96: LuCloudLightning,
  99: LuCloudLightning,
};

export function getWeatherIcon(code: number): IconType {
  return weatherIconMap[code] ?? LuSun;
}

/** Wrapper to render weather icon by code - uses switch to avoid "component created during render" lint */
export function WeatherIcon({
  code,
  className,
  ...props
}: { code: number } & React.ComponentProps<IconType>) {
  const iconProps = { className, ...props };
  switch (code) {
    case 1:
    case 2:
      return <LuCloudSun {...iconProps} />;
    case 3:
      return <LuCloudy {...iconProps} />;
    case 45:
    case 48:
      return <LuCloudFog {...iconProps} />;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return <LuCloudDrizzle {...iconProps} />;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return <LuCloudRain {...iconProps} />;
    case 71:
    case 73:
    case 75:
    case 85:
    case 86:
      return <LuSnowflake {...iconProps} />;
    case 77:
      return <LuCloudSnow {...iconProps} />;
    case 95:
    case 96:
    case 99:
      return <LuCloudLightning {...iconProps} />;
    default:
      return <LuSun {...iconProps} />;
  }
}

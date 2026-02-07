# Weather App

A weather application built with Next.js that allows users to search for weather by US ZIP code. Displays current temperature, location, weather icon, and a 5-day forecast with Fahrenheit/Celsius toggle.

## Features

- **ZIP Code Search**: Enter any US ZIP code to fetch weather data
- **Current Weather**: Temperature, city + state, and weather icon
- **5-Day Forecast**: Daily high temperatures with weather icons
- **Unit Toggle**: Switch between Fahrenheit and Celsius with smooth transitions
- **Responsive Design**: Scales proportionally from 250px to 600px width
- **Smooth Animations**: Flip card transitions, fade effects, and loading states

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide Icons (via react-icons)
- **Font**: Poppins (weights 400, 500)
- **Code Quality**: ESLint 9, Prettier, Husky

## APIs Used

- **[Zippopotam](https://zippopotam.us/)**: Free API for ZIP code → location (city, state, lat/lon). No API key required.
- **[Open-Meteo](https://open-meteo.com/)**: Free weather API. No API key required. Provides current conditions and 5-day forecast using WMO weather codes.

## Getting Started

### Prerequisites

- Node.js 18+ (tested with Node 20+)
- npm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically load weather for Houston, TX (ZIP 77001) on initial load.

### Build for Production

```bash
npm run build
npm start
```

### Code Quality Scripts

```bash
npm run format        # Format code with Prettier
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run typecheck     # TypeScript type checking
npm run check         # Run format check, lint, and typecheck
npm run premerge      # Format, lint:fix, lint, and build (for pre-commit)
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with Poppins font
│   ├── page.tsx        # Main weather page with scaling logic
│   ├── globals.css     # Global styles and animations
│   └── icon.tsx        # App icon
├── components/
│   ├── ZipSearch.tsx           # ZIP input + search button
│   ├── FlipWeatherCard.tsx     # 3D flip card wrapper
│   ├── WeatherCard.tsx         # Main weather display
│   ├── DayForecastCard.tsx     # Individual forecast day
│   └── TemperatureToggle.tsx   # °F / °C toggle switch
├── hooks/
│   └── useFlipCard.ts  # Flip animation logic
├── lib/
│   ├── weather.ts       # API integration, types
│   └── weather-icons.tsx # WMO code → Lucide icon mapping
├── providers/
│   └── WeatherProvider.tsx # Weather state management
└── tokens/
    └── colors.css       # Color tokens
```

## Setup Notes

### Responsive Scaling System

The app uses a CSS `transform: scale()` approach to make all components (fonts, dimensions, icons) scale proportionally based on screen width:

- **Base width**: 380px (design reference)
- **Min width**: 250px
- **Max width**: 600px
- **Padding**: Always maintains 16px horizontal padding from screen edges
- **Scaling**: Calculated as `(window.innerWidth - 32) / 380`, clamped between min/max

This ensures the entire UI scales smoothly while maintaining proportions across all screen sizes.

### Font Configuration

- **Font Family**: Poppins (Google Fonts)
- **Weights**: 400 (regular), 500 (medium)
- **Default line-height**: 1 (set globally in `globals.css`)

### Icon System

- Uses **Lucide Icons** (via `react-icons/lu`)
- Icons are mapped to Open-Meteo's WMO weather codes
- `WeatherIcon` component wraps icon rendering to avoid React lint warnings

### Initial State

- App loads with Houston, TX weather (ZIP 77001) by default
- Temperature unit defaults to Fahrenheit
- Content fades in after initial scale calculation

## Decisions & Assumptions

### API Choices

1. **Zippopotam API**: Chosen for simplicity—free, no API key, supports US ZIP codes. International postal codes would require a different geocoding service.

2. **Open-Meteo API**: Selected for its simplicity—no API key, generous rate limits, clean JSON, and uses standard WMO weather codes. Returns temperatures in Celsius; conversion to Fahrenheit is done client-side.

### Architecture Decisions

3. **Client-Side Fetching**: All API calls happen in the browser. This keeps the app simple and avoids needing a backend. For production at scale, consider adding API routes to proxy requests, cache responses, and handle rate limiting.

4. **Responsive Scaling**: Used CSS `transform: scale()` instead of media queries to ensure all elements (fonts, spacing, icons) scale proportionally. This maintains visual consistency across screen sizes.

5. **Icon Library**: Switched from Weather Icons (Wi) to Lucide Icons for better consistency and modern design. Lucide provides clean, consistent stroke-based icons that match the app's aesthetic.

6. **State Management**: Uses React Context (`WeatherProvider`) for global weather state. Simple and sufficient for this single-page app. For larger apps, consider Zustand or Redux.

7. **Animation Approach**:
   - Flip card uses CSS 3D transforms for smooth card flip effect
   - Temperature changes use opacity transitions (250ms fade)
   - Loading states use fade-out/flip-in sequence
   - Initial page load fades in after scale calculation

### Code Quality

8. **ESLint Version**: Using ESLint 9 (not 10) because `eslint-config-next` and `eslint-plugin-react` are not yet compatible with ESLint 10's API changes.

9. **Component Patterns**:
   - Used `WeatherIcon` wrapper component to avoid "component created during render" lint warnings
   - Wrapped synchronous `setState` calls in `queueMicrotask()` to avoid cascading render warnings
   - All components follow React best practices

10. **Pre-commit Hooks**: Husky is configured to run checks before commits. The `premerge` script runs format, lint:fix, lint, and build to ensure code quality.

### UX Decisions

11. **Error Handling**: Invalid ZIP codes or API failures show user-friendly error messages in a toast that auto-dismisses after 5 seconds. The app handles loading and empty states gracefully.

12. **Temperature Display**: Large, bold temperature (85px) with smaller degree symbol (48px) for visual hierarchy. Uses tabular numbers for consistent width during transitions.

13. **Toggle Design**: Simple horizontal toggle switch (40px × 25px) with purple accent. Labels don't change color when active to reduce visual noise.

14. **Accessibility**:

- All interactive elements are keyboard accessible
- Focus states use purple ring with 2px offset
- ARIA labels on icons
- Proper semantic HTML

## Deployment

https://w347h3r.netlify.app

```bash
npx vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

The app is fully static and can be deployed to any static hosting service (Netlify, GitHub Pages, etc.).

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { WeatherProvider } from "@/providers/WeatherProvider";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather App",
  description: "Search weather by US ZIP code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <WeatherProvider>{children}</WeatherProvider>
      </body>
    </html>
  );
}

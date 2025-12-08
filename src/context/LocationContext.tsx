"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeatherData, ForecastItem } from '@/lib/types';

const defaultForecast: ForecastItem[] = Array(8).fill({
  day: "-", 
  full: "Loading...", 
  condition: "Sunny", 
  temp: 0, 
  low: 0, 
  high: 0, 
  rain: false, 
  wind: 0, 
  humidity: 0, 
  feelsLike: 0,
  windDirCode: "-", 
  windDir: "Loading Direction",
  visibility: 0,
  uv: 0,
  hourlyRainfall: []
});

type LocationType = {
  name: string;
  adm4: string; 
  lat: number;
  lng: number;
};

interface LocationContextType {
  activeLocation: LocationType;
  setActiveLocation: (loc: LocationType) => void;
  weather: WeatherData | null;
  forecast: ForecastItem[];
  loading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [activeLocation, setActiveLocation] = useState<LocationType>({
    name: "Makassar, Indonesia",
    adm4: "73.71.11.1001", 
    lat: -5.1477,
    lng: 119.4327,
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>(defaultForecast);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!activeLocation.adm4) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?adm4=${activeLocation.adm4}`);
        const data = await res.json();
        
        if (data.current) setWeather(data.current);
        if (data.forecast) setForecast(data.forecast);
        
        if (data.location) {
          setActiveLocation(prev => ({
            ...prev,
            lat: parseFloat(data.location.lat),
            lng: parseFloat(data.location.lon)
          }));
        }
      } catch (error) {
        console.error("Failed fetch", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeLocation.adm4]);

  return (
    <LocationContext.Provider value={{ activeLocation, setActiveLocation, weather, forecast, loading }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation error");
  return context;
};
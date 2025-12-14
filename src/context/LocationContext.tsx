"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeatherData, ForecastItem } from '@/lib/types';

interface DashboardMapProps {
  onExpand?: () => void;
  isExpanded?: boolean;
}

// Update Default Value
const defaultForecast: ForecastItem[] = Array(8).fill({
  day: "-", 
  full: "Loading...", 
  weekday: "-",        // Default baru
  dateDisplay: "-",    // Default baru
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
  uv: 0
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
  // Default: Makassar
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
      let apiUrl = "";
      
      // 1. Prioritaskan fetch berdasarkan adm4 (dari search bar/default)
      if (activeLocation.adm4) {
        apiUrl = `/api/weather?adm4=${activeLocation.adm4}`;
      } 
      // 2. Gunakan lat/lng jika adm4 kosong (dari map click)
      else if (activeLocation.lat && activeLocation.lng) {
        // Asumsi API endpoint Anda menerima lat dan lon
        apiUrl = `/api/weather?lat=${activeLocation.lat}&lon=${activeLocation.lng}`;
      } 
      // 3. Jika tidak ada data yang valid, hentikan
      else {
        return; 
      }

      setLoading(true);
      setWeather(null); 
      setForecast(defaultForecast);
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        
        if (data.current) setWeather(data.current);
        if (data.forecast) setForecast(data.forecast);
        
        if (data.location) {
          // Update lat, lon, dan nama lokasi (nama yang lebih baik dari backend)
          setActiveLocation(prev => ({
            ...prev,
            lat: parseFloat(data.location.lat),
            lng: parseFloat(data.location.lon),
            name: data.location.name || prev.name // Gunakan nama yang dikirim backend
          }));
        }
      } catch (error) {
        console.error("Failed fetch", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // Perbarui dependencies agar terpicu saat lat/lng berubah
  }, [activeLocation.adm4, activeLocation.lat, activeLocation.lng]);

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
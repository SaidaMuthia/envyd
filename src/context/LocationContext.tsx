//

"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeatherData, ForecastItem } from '@/lib/types';
// HAPUS import findNearestCity yang lama karena kita akan pakai API
// import { findNearestCity } from "@/utils/geoHelpers"; 

const defaultForecast: ForecastItem[] = Array(8).fill({
  day: "-", full: "Loading...", condition: "Sunny", temp: 0, low: 0, high: 0, rain: false, wind: 0, humidity: 0, feelsLike: 0
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

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [activeLocation, setActiveLocation] = useState<LocationType>({
    name: "Jakarta",
    lat: -6.2088,
    lng: 106.8456,
    adm4: "",
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>(defaultForecast);
  const [loading, setLoading] = useState(false);

  // LOGIKA DETEKSI LOKASI (DIPERBAIKI: Menggunakan API Server)
  useEffect(() => {
    // Fungsi untuk memanggil API Reverse Geocoding
    const fetchNearestLocation = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch('/api/search-location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lat: latitude, lng: longitude }),
        });

        if (response.ok) {
          const nearestCity = await response.json();
          // Update lokasi dengan data presisi dari server
          setActiveLocation({
            name: nearestCity.name,
            lat: nearestCity.lat,
            lng: nearestCity.lng, // Pastikan API return 'lng' atau sesuaikan jika 'lon'
            adm4: nearestCity.adm4 || "",
          });
        }
      } catch (error) {
        console.error("Failed to find nearest city via API:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Panggil API alih-alih hitung manual di client
          fetchNearestLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error detecting location:", error);
          // Fallback ke default (Jakarta) jika gagal/ditolak
        }
      );
    }
  }, []); // Run sekali saat mount

  // ... (Sisa kode useEffect fetchWeather tetap sama) ...
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
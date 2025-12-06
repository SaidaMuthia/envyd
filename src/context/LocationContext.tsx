"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipe data sederhana
type LocationType = {
  name: string;
  lat: number;
  lng: number;
};

const LocationContext = createContext<{
  activeLocation: LocationType;
  setActiveLocation: (loc: LocationType) => void;
} | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [activeLocation, setActiveLocation] = useState<LocationType>({
    name: "Makassar, Indonesia", // Default
    lat: -5.1477,
    lng: 119.4327,
  });

  return (
    <LocationContext.Provider value={{ activeLocation, setActiveLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within LocationProvider");
  return context;
};
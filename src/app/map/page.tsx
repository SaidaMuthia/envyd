"use client";

import dynamic from "next/dynamic";
import { LocationProvider } from "@/context/LocationContext"; // WRAP DENGAN PROVIDER

// Import Map secara Dynamic
const FullInteractiveMap = dynamic(() => import("@/components/map/FullInteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#F4F7FE] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#2B3674] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2B3674] font-bold animate-pulse">Loading Map...</p>
    </div>
  )
});

export default function MapPage() {
  // PENTING: Halaman ini butuh akses ke Context Location agar tahu user sedang pilih lokasi apa
  return (
    <LocationProvider>
       <FullInteractiveMap />
    </LocationProvider>
  );
}
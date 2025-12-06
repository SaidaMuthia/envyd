// src/components/map/FullInteractiveMap.tsx

"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ArrowLeft, X } from "lucide-react"; 
import { useRouter } from "next/navigation";

// Import Header Utama
import Header from "@/components/layout/Header";

// Import komponen visualisasi
import WeatherMain from "@/components/dashboard/WeatherMain";
import StatCard from "@/components/dashboard/StatCard";
import { WindCompass, FeelsLikeSlider, HumidityBars } from "@/components/dashboard/Visuals";

// Fix Icon Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function FullInteractiveMap() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [locationName, setLocationName] = useState("Makassar, Indonesia");

  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        setIsSidebarOpen(true);
        setLocationName(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      },
    });
    return null;
  }

  const weatherData = {
    temp: 32,
    condition: "Sunny",
    low: 28,
    high: 34,
    wind: 16,
    feelsLike: 30,
    humidity: 71
  };

  return (
    <div className="relative w-full h-screen bg-[#F4F7FE] overflow-hidden font-sans text-[#1B2559]">
      
      {/* --- FLOATING HEADER --- */}
      <div className="absolute top-0 left-0 right-0 z-1200 px-6 pt-6 pb-2 pointer-events-none">
          <div className="pointer-events-auto">
             <Header />
          </div>
      </div>

      {/* --- TOMBOL BACK (Bulat di Kiri Atas) --- */}
      <button 
          onClick={() => router.push('/')}
          className="absolute top-[110px] left-6 z-1100 bg-white w-10 h-10 rounded-full shadow-lg text-[#1B2559] hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center border border-white"
      >
          <ArrowLeft size={20} />
      </button>

      {/* --- MAP --- */}
      <MapContainer 
        center={[-5.1477, 119.4327]} 
        zoom={13} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {selectedLocation && <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={icon} />}
      </MapContainer>

      {/* --- SIDEBAR PANEL --- */}
      <div 
        className={`
            fixed z-1100
            right-4 md:right-6 
            top-[110px] bottom-4 md:bottom-6 
            w-[calc(100%-2rem)] md:w-[420px] 
            bg-[#F4F7FE] 
            shadow-[0_10px_40px_rgba(112,144,176,0.25)] 
            border border-white/60
            rounded-[30px] 
            transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] 
            flex flex-col overflow-hidden
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[120%]'}
        `}
      >
        {/* 1. Sidebar Header */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-start shrink-0 bg-[#F4F7FE]">
            <div>
                <div className="flex items-center gap-2 mb-1.5">
                    <img src="/images/Location_icon.svg" alt="Location" className="w-5 h-5" />
                    <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Selected Location</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1B2559] leading-tight line-clamp-2 pr-4">{locationName}</h2>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 bg-white rounded-full shadow-sm text-[#A3AED0] hover:text-[#2B3674] hover:shadow-md transition-all mt-1"
            >
                <X size={20} />
            </button>
        </div>

        {/* 2. Sidebar Content (Scrollable) */}
        {/* PERUBAHAN: Padding bawah normal (pb-6), tombol dimasukkan ke sini */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 elegant-scrollbar">
            
            {/* Main Weather Card */}
            <div className="w-full">
                <WeatherMain 
                    title="Today"
                    temp={weatherData.temp}
                    condition={weatherData.condition}
                    low={weatherData.low}
                    high={weatherData.high}
                />
            </div>

            {/* Grid StatCards */}
            <div className="grid grid-cols-2 gap-3">
                
                {/* Wind */}
                <StatCard 
                    icon={<img src="/images/Wind_icon.svg" alt="Wind" className="w-4 h-4" />}
                    title="Wind"
                    className="col-span-1 min-h-[200px] p-4!"
                    footer={
                        <div className="mt-auto">
                            <span className="text-lg font-bold text-[#1B1B1E]">{weatherData.wind} km/h</span>
                        </div>
                    }
                >
                    <div className="scale-75 origin-center -mt-2"><WindCompass /></div>
                </StatCard>

                {/* Humidity */}
                <StatCard 
                    icon={<img src="/images/Humidity_icon.svg" alt="Humidity" className="w-4 h-4" />}
                    title="Humidity"
                    className="col-span-1 min-h-[200px] p-4!"
                    footer={
                        <div className="mt-auto">
                            <span className="text-lg font-bold text-[#1B1B1E]">{weatherData.humidity}%</span>
                        </div>
                    }
                >
                    <div className="mt-4 w-full"><HumidityBars /></div>
                </StatCard>

                {/* Feels Like (Full Width) */}
                <StatCard 
                    icon={<img src="/images/Feels_like_icon.svg" alt="Feels Like" className="w-4 h-4" />}
                    title="Feels Like"
                    className="col-span-2 min-h-[150px] p-4!"
                    footer={
                        <div className="flex justify-between w-full mt-auto text-sm">
                            <span className="font-bold text-[#1B1B1E]">Feels: {weatherData.feelsLike}°</span>
                            <span className="font-bold text-[#1B1B1E]">Act: {weatherData.temp}°</span>
                        </div>
                    }
                >
                    <div className="w-full px-2 mt-1"><FeelsLikeSlider value={weatherData.feelsLike} /></div>
                </StatCard>

            </div>

            {/* 3. Tombol Footer (Sekarang ada di DALAM scroll view, paling bawah) */}
            <div className="pt-4 pb-2">
                <button 
                    onClick={() => router.push('/')}
                    className="w-full bg-[#2B3674] hover:bg-[#1B1B1E] text-white text-sm font-bold py-3.5 rounded-[20px] shadow-[0_10px_20px_rgba(43,54,116,0.2)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                >
                    See Full Forecast Details
                    <div className="bg-white/20 p-1 rounded-full">
                        <ArrowLeft size={16} className="rotate-180" />
                    </div>
                </button>
            </div>

        </div>

      </div>
    </div>
  );
}
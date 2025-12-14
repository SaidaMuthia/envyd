//

"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ArrowLeft, X } from "lucide-react"; 
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useLocation } from "@/context/LocationContext";
import WeatherMain from "@/components/dashboard/WeatherMain";
import StatCard from "@/components/dashboard/StatCard";
import { WindCompass, FeelsLikeSlider, HumidityBars } from "@/components/dashboard/Visuals";

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    // Menggunakan flyTo untuk transisi yang mulus ke lokasi baru
    map.flyTo(center, map.getZoom(), {
      duration: 1.5 // Durasi animasi dalam detik
    });
  }, [center, map]); // map ditambahkan sebagai dependensi, meskipun jarang berubah

  return null; // Komponen ini tidak merender apa-apa secara visual
}
export default function FullInteractiveMap({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeLocation, setActiveLocation, weather, loading } = useLocation();
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);

  // Fix SSR: Init icon di client side
  useEffect(() => {
    if (typeof window !== "undefined") {
        setCustomIcon(L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        }));
    }
  }, []);

  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        // PENTING: Update lokasi harus memicu fetch weather baru
        setActiveLocation({
            name: `Lokasi Terpilih (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
            lat: lat,
            lng: lng,
            adm4: "" // Backend akan handle adm4
        });
        setIsSidebarOpen(true);
      },
    });
    return null;
  }

  // Gunakan data weather real atau fallback
  const currentData = weather || {
    temp: 0, condition: "Unknown", low: 0, high: 0, windSpeed: 0, feelsLike: 0, humidity: 0
  };

  const handleBack = () => {
    if (onClose) onClose(); 
    else router.push('/'); 
  };

  if (!customIcon) return null;

  return (
    <div className="fixed inset-0 z-2000 bg-[#F4F7FE] font-sans text-[#1B2559]">
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-1200 w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-[1920px] px-4 md:px-8 pt-4 md:pt-8 pointer-events-auto">
              <Header />
          </div>
      </div>

      {/* Back Button */}
      <button 
          onClick={handleBack}
          className="absolute top-[85px] md:top-[120px] left-4 md:left-8 z-1100 bg-white w-10 h-10 rounded-full shadow-lg text-[#1B2559] hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center border border-white"
      >
          <ArrowLeft size={20} />
      </button>

      {/* MAP CONTAINER - WAJIB HEIGHT EKSPLISIT */}
      <div className="w-full h-full absolute inset-0 z-0">
          <MapContainer 
            center={[activeLocation.lat, activeLocation.lng]} 
            zoom={10} 
            style={{ height: "100%", width: "100%" }} 
            zoomControl={false}
          >
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <ChangeView center={[activeLocation.lat, activeLocation.lng]} />
            <MapClickHandler />
            <Marker position={[activeLocation.lat, activeLocation.lng]} icon={customIcon} />
          </MapContainer>
      </div>

      {/* SIDEBAR PANEL */}
      <div 
        className={`
            absolute z-1100
            right-4 md:right-8 
            top-[85px] md:top-[120px] bottom-4 md:bottom-6 
            w-[calc(100%-2rem)] md:w-[420px] 
            bg-[#F4F7FE]/95 backdrop-blur-md
            shadow-2xl border border-white
            rounded-[30px] 
            transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] 
            flex flex-col overflow-hidden
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[120%]'}
        `}
      >
        <div className="px-6 pt-6 pb-4 flex justify-between items-start shrink-0">
            <div>
                <div className="flex items-center gap-2 mb-1.5">
                    <img src="/images/Location_icon.svg" alt="Location" className="w-5 h-5" />
                    <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Selected Location</span>
                </div>
                <h2 className="text-xl font-bold text-[#1B2559] leading-tight line-clamp-2 pr-4">
                    {activeLocation.name}
                </h2>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 bg-white rounded-full shadow-sm text-[#A3AED0] hover:text-[#2B3674] hover:shadow-md transition-all mt-1 cursor-pointer"
            >
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 elegant-scrollbar relative">
            {loading && (
                <div className="absolute inset-0 z-50 bg-[#F4F7FE]/70 backdrop-blur-sm flex items-center justify-center rounded-b-[30px] rounded-t-lg">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-[#2B3674] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[#2B3674] font-bold text-sm">Loading Data...</p>
                    </div>
                </div>
            )}
            <WeatherMain 
                title="Current Weather" 
                temp={currentData.temp} 
                condition={currentData.condition} 
                low={currentData.low} 
                high={currentData.high} 
            />

            <div className="grid grid-cols-2 gap-3">
                <StatCard 
                    icon={<img src="/images/Wind_icon.svg" alt="Wind" className="w-4 h-4" />}
                    title="Wind"
                    className="col-span-1"
                    footer={<div className="mt-auto"><span className="text-lg font-bold text-[#1B1B1E]">{currentData.windSpeed} km/h</span></div>}
                >
                    <div className="scale-75 origin-center -mt-2"><WindCompass /></div>
                </StatCard>

                <StatCard 
                    icon={<img src="/images/Humidity_icon.svg" alt="Hum" className="w-4 h-4" />}
                    title="Humidity"
                    className="col-span-1"
                    footer={<div className="mt-auto"><span className="text-lg font-bold text-[#1B1B1E]">{currentData.humidity}%</span></div>}
                >
                    <div className="mt-4 w-full"><HumidityBars /></div>
                </StatCard>

                <StatCard 
                    icon={<img src="/images/Feels_like_icon.svg" alt="Feels" className="w-4 h-4" />}
                    title="Feels Like"
                    className="col-span-2"
                    footer={
                        <div className="flex justify-between w-full mt-auto text-sm">
                            <span className="font-bold text-[#1B1B1E]">Feels: {currentData.feelsLike}°</span>
                            <span className="font-bold text-[#1B1B1E]">Act: {currentData.temp}°</span>
                        </div>
                    }
                >
                    <div className="w-full px-2 mt-1"><FeelsLikeSlider value={currentData.feelsLike} /></div>
                </StatCard>
            </div>

            <div className="pt-2">
                <button 
                    onClick={handleBack} 
                    className="w-full bg-[#2B3674] hover:bg-[#1B1B1E] text-white text-sm font-bold py-3.5 rounded-[20px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                    Set as Active Location
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
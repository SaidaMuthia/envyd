//

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { VisibilityPyramid, UvGauge, RainChart } from "@/components/dashboard/Visuals";
import { useLocation } from "@/context/LocationContext";

const getUvStatus = (uvIndex: number) => {
    if (uvIndex < 3) return "Rendah (Low)";
    if (uvIndex < 6) return "Sedang (Moderate)";
    if (uvIndex < 8) return "Tinggi (High)";
    if (uvIndex < 11) return "Sangat Tinggi (Very High)";
    return "Ekstrem (Extreme)";
};

export default function WeatherDetailsSlider() {
  const [detailIndex, setDetailIndex] = useState(0);
  const { forecast, loading, weather } = useLocation();
  const safeData = weather || (forecast.length > 0 ? forecast[0] : null);
  
  const rainData = forecast.length > 0 ? forecast[0].hourlyRainfall : [];

  const nextDetail = () => setDetailIndex((prev) => (prev === 2 ? 0 : prev + 1));
  const prevDetail = () => setDetailIndex((prev) => (prev === 0 ? 2 : prev - 1));
  
  const visibilityKm = safeData && safeData.visibility !== undefined
      ? safeData.visibility.toFixed(1)
      : (loading ? '...' : 'N/A');
      
  const currentUvIndex = safeData ? (safeData.uv || 0) : 0; 
  const uvStatus = getUvStatus(currentUvIndex);
  const uvDesc = currentUvIndex >= 8 
        ? "Wajib gunakan pelindung. Hindari matahari pukul 10-4." 
        : "Amankan diri dengan topi dan kacamata hitam.";

  const UNIFIED_TITLE_COLOR = "text-[#345B92]";

  const slides = [
    {
      id: "visibility",
      title: "Visibility",
      color: UNIFIED_TITLE_COLOR,
      icon: "/images/Visibility_icon.svg",
      component: <VisibilityPyramid />,
      mainValue: `Visibility: ${visibilityKm} km`,
      desc: "Jarak pandang baik untuk berkendara. Waspada terhadap sedikit haze.",
      scale: "scale-100" 
    },
    {
      id: "uv",
      title: "UV Index",
      color: UNIFIED_TITLE_COLOR,
      icon: "/images/UV_icon.svg",
      component: <UvGauge uvValue={currentUvIndex} />,
      mainValue: uvStatus,
      desc: "Stay inside.",
      scale: "scale-100" 
    },
    {
      id: "rain",
      title: "Curah Hujan",
      color: UNIFIED_TITLE_COLOR,
      icon: "/images/Curah_hujan_icon.svg",
      component: <RainChart hourlyData={rainData} />,
      isRainChart: true, 
      scale: "scale-100"
    }
  ];

  const currentSlide = slides[detailIndex];

  return (
    <StatCard className="h-full relative overflow-hidden p-0!"> 
        {/* Padding standar, arrow akan absolute di atasnya */}
        <div className="flex flex-col h-full w-full p-6 relative">
            
            {/* --- ARROWS (ABSOLUTE POSITION - STAY) --- */}
            {/* Tidak punya background, hanya icon kecil */}
            <button 
                onClick={prevDetail} 
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-[#2B3674]/40 hover:text-[#2B3674] transition-colors cursor-pointer p-2"
            >
                <ChevronLeft size={20} />
            </button>

            <button 
                onClick={nextDetail} 
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-[#2B3674]/40 hover:text-[#2B3674] transition-colors cursor-pointer p-2"
            >
                <ChevronRight size={20} />
            </button>

            {/* --- CONTENT CONTAINER --- */}
            {/* px-4 untuk memberi jarak dari arrow */}
            <div className="flex flex-col h-full w-full px-4 animate-in fade-in zoom-in duration-300">
                
                {/* Header */}
                <div className="flex items-center gap-3 h-8 shrink-0 mb-1">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <img 
                            src={currentSlide.icon} 
                            alt={currentSlide.title} 
                            className="w-6 h-6"
                            onError={(e) => e.currentTarget.src = ''} 
                        />
                    </div>
                    <span className={`font-bold text-base ${currentSlide.color}`}>
                        {currentSlide.title}
                    </span>
                </div>

                {/* Visual Area - Mengisi ruang tengah */}
                <div className={`flex-1 flex justify-center items-center w-full overflow-visible ${currentSlide.scale}`}>
                    {currentSlide.component}
                </div>

                {/* Footer Info - Konsisten 60px */}
                <div className={`mt-auto min-h-[60px] flex flex-col justify-end`}>
                    {currentSlide.isRainChart ? (
                        // Footer Kosong tapi Tinggi Tetap Ada (Spacer)
                        // Label text sudah ada di Visuals.tsx
                        <div className="w-full h-full" />
                    ) : (
                        <div className="w-full">
                            <div className="text-xl font-bold text-[#1B1B1E] mb-1 truncate">
                                {currentSlide.mainValue}
                            </div>
                            <p className="text-[10px] text-[#A3AED0] leading-snug line-clamp-2">
                                {currentSlide.desc}
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    </StatCard>
  );
}
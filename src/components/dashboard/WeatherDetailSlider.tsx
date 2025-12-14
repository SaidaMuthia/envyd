"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { VisibilityPyramid, UvGauge } from "@/components/dashboard/Visuals";
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
  
  // Navigation functions updated for 2 slides (indices 0 and 1)
  const nextDetail = () => setDetailIndex((prev) => (prev === 1 ? 0 : prev + 1));
  const prevDetail = () => setDetailIndex((prev) => (prev === 0 ? 1 : prev - 1));
  
  // --- PERBAIKAN DISPLAY VISIBILITY ---
  // Pastikan 0 ditampilkan sebagai string "0.0", bukan falsy value
  const visibilityKm = (safeData && typeof safeData.visibility === 'number')
      ? safeData.visibility.toFixed(1)
      : (loading ? "..." : "0.0");

  const currentUvIndex = (weather?.uv !== undefined && weather.uv !== null) ? Number(weather.uv) : 0; 
  const uvStatus = getUvStatus(currentUvIndex);
  const uvDesc = currentUvIndex >= 8 
        ? "Wajib gunakan pelindung." 
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
      desc: uvDesc,
      scale: "scale-100" 
    }
  ];

  const currentSlide = slides[detailIndex];

  return (
    <StatCard className="h-full relative overflow-hidden p-0!"> 
        <div className="flex flex-col h-full w-full p-5 relative">
            
            {/* Header */}
            <div className="flex items-center gap-3 h-8 shrink-0 mb-2">
                <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                        src={currentSlide.icon} 
                        alt={currentSlide.title} 
                        className="w-5 h-5"
                        onError={(e) => e.currentTarget.src = ''} 
                    />
                </div>
                <span className={`font-bold text-base ${currentSlide.color}`}>
                    {currentSlide.title}
                </span>
            </div>

            {/* Visual Grid */}
            <div className="flex-1 grid grid-cols-[20px_1fr_20px] items-center w-full my-1">
                <div className="flex justify-start">
                    <button onClick={prevDetail} className="text-[#2B3674]/40 hover:text-[#2B3674] transition-colors cursor-pointer">
                        <ChevronLeft size={16} />
                    </button>
                </div>

                <div className={`w-full flex justify-center items-center h-full overflow-visible ${currentSlide.scale}`}>
                    {currentSlide.component}
                </div>

                <div className="flex justify-end">
                    <button onClick={nextDetail} className="text-[#2B3674]/40 hover:text-[#2B3674] transition-colors cursor-pointer">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto flex flex-col justify-end h-[60px]">
                <div className="w-full">
                    <div className="text-xl font-bold text-[#1B1B1E] mb-1 truncate">
                        {currentSlide.mainValue}
                    </div>
                    <p className="text-[10px] text-[#A3AED0] leading-snug line-clamp-2">
                        {currentSlide.desc}
                    </p>
                </div>
            </div>

        </div>
    </StatCard>
  );
}
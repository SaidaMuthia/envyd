"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { VisibilityPyramid, UvGauge, RainChart } from "@/components/dashboard/Visuals";
import { useLocation } from "@/context/LocationContext";

export default function WeatherDetailsSlider() {
  const { weather, loading } = useLocation();
  const [detailIndex, setDetailIndex] = useState(0);

  const nextDetail = () => setDetailIndex((prev) => (prev === 2 ? 0 : prev + 1));
  const prevDetail = () => setDetailIndex((prev) => (prev === 0 ? 2 : prev - 1));

  const UNIFIED_TITLE_COLOR = "text-[#345B92]";

  // --- LOGIC DATA ---
  let visVal = "8 km";
  let visDesc = "Jarak pandang baik untuk berkendara.";
  
  let uvVal = "Sangat Tinggi";
  let uvDesc = "Gunakan tabir surya.";
  let uvNum = 0;

  if (weather && !loading) {
    // Visibility
    const vis = weather.visibility;
    visVal = `${vis} km`;
    if (vis >= 10) visDesc = "Pandangan sangat jernih.";
    else if (vis >= 5) visDesc = "Jarak pandang baik.";
    else if (vis >= 2) visDesc = "Hati-hati, jarak pandang terbatas.";
    else visDesc = "Bahaya! Jarak pandang sangat pendek.";

    // UV Index
    uvNum = weather.uv || 0;
    if (uvNum < 3) { uvVal = "Rendah"; uvDesc = "Aman beraktivitas di luar."; }
    else if (uvNum < 6) { uvVal = "Sedang"; uvDesc = "Gunakan topi saat terik."; }
    else if (uvNum < 8) { uvVal = "Tinggi"; uvDesc = "Wajib gunakan sunscreen."; }
    else { uvVal = "Ekstrem"; uvDesc = "Bahaya! Hindari paparan matahari."; }
  }

  const slides = [
    {
      id: "visibility",
      title: "Visibility",
      color: UNIFIED_TITLE_COLOR,
      icon: "/images/Visibility_icon.svg",
      component: <VisibilityPyramid value={weather?.visibility} />,
      mainValue: visVal,
      desc: visDesc,
      scale: "scale-100" 
    },
    {
      id: "uv",
      title: "UV Index",
      color: UNIFIED_TITLE_COLOR,
      icon: "/images/UV_icon.svg",
      component: <UvGauge value={uvNum} />,
      mainValue: `${uvNum} (${uvVal})`,
      desc: uvDesc,
      scale: "scale-100" 
    },
    {
      id: "rain",
      title: "Curah Hujan",
      color: UNIFIED_TITLE_COLOR,
      icon: "/images/Curah_hujan_icon.svg",
      component: <RainChart />,
      isRainChart: true, 
      scale: "scale-100"
    }
  ];

  const currentSlide = slides[detailIndex];

  const footerContent = currentSlide.isRainChart ? null : (
      <div className="mt-auto min-h-[60px] flex flex-col justify-end w-full">
          <div className="text-2xl font-bold text-[#1B1B1E] mb-1">
              {currentSlide.mainValue}
          </div>
          <p className="text-xs text-[#A3AED0] leading-relaxed line-clamp-2">
              {currentSlide.desc}
          </p>
      </div>
  );

  return (
    <StatCard 
        className="h-full relative overflow-hidden group" 
        headerContent={
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                    <img 
                        src={currentSlide.icon} 
                        alt={currentSlide.title} 
                        className="w-5 h-5 object-contain"
                        onError={(e) => e.currentTarget.src = ''} 
                    />
                </div>
                <span className={`font-bold text-base ${currentSlide.color}`}>
                    {currentSlide.title}
                </span>
            </div>
        }
        footer={footerContent}
    > 
        <button 
            onClick={prevDetail} 
            className="absolute left-0.5 top-1/2 -translate-y-1/2 z-20 p-0.5 text-[#2B3674]/40 hover:text-[#2B3674] transition-all cursor-pointer"
        >
            <ChevronLeft size={16} />
        </button>

        <button 
            onClick={nextDetail} 
            className="absolute right-0.5 top-1/2 -translate-y-1/2 z-20 p-0.5 text-[#2B3674]/40 hover:text-[#2B3674] transition-all cursor-pointer"
        >
            <ChevronRight size={16} />
        </button>

        <div className="flex flex-col h-full w-full animate-in fade-in zoom-in duration-300">
            <div className="flex-1 flex items-center justify-center w-full my-2 relative">
                <div className={`w-full flex justify-center items-center h-full overflow-visible ${currentSlide.scale}`}>
                    {currentSlide.component}
                </div>
            </div>
        </div>
    </StatCard>
  );
}
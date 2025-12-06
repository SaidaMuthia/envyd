//

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { VisibilityPyramid, UvGauge, RainChart } from "@/components/dashboard/Visuals";

export default function WeatherDetailsSlider() {
  const [detailIndex, setDetailIndex] = useState(0);

  const nextDetail = () => setDetailIndex((prev) => (prev === 2 ? 0 : prev + 1));
  const prevDetail = () => setDetailIndex((prev) => (prev === 0 ? 2 : prev - 1));

  // Warna judul diseragamkan di sini
  const UNIFIED_TITLE_COLOR = "text-[#345B92]";

  const slides = [
    {
      id: "visibility",
      title: "Visibility",
      color: UNIFIED_TITLE_COLOR, // Warna seragam
      icon: "/images/Visibility_icon.svg",
      component: <VisibilityPyramid />,
      mainValue: "Visibility: 8 km",
      desc: "Jarak pandang baik untuk berkendara. Waspada terhadap sedikit haze (kabut tipis) atau partikel udara.",
      scale: "scale-100" 
    },
    {
      id: "uv",
      title: "UV Index",
      color: UNIFIED_TITLE_COLOR, // Warna seragam
      icon: "/images/UV_icon.svg",
      component: <UvGauge />,
      mainValue: "Sangat Tinggi",
      desc: "Stay inside.",
      scale: "scale-110" 
    },
    {
      id: "rain",
      title: "Curah Hujan",
      color: UNIFIED_TITLE_COLOR, // Warna seragam
      icon: "/images/Curah_hujan_icon.svg",
      component: <RainChart />,
      isRainChart: true, 
      scale: "scale-100"
    }
  ];

  const currentSlide = slides[detailIndex];

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-[#1B2559] mb-4">Detail Cuaca Lainnya</h2>

      <StatCard className="h-full relative overflow-hidden p-0!"> 
        
        <div className="flex flex-col h-full w-full p-6 animate-in fade-in zoom-in duration-300">
            
            {/* --- 1. HEADER (DIPERBAIKI) --- */}
            <div className="flex items-center gap-3 h-10 shrink-0">
                {/* Menghapus bg-[#F4F7FE] dan rounded-full agar icon tidak ada background abu */}
                <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                        src={currentSlide.icon} 
                        alt={currentSlide.title} 
                        className="w-6 h-6" // Icon sedikit diperbesar agar jelas
                        onError={(e) => e.currentTarget.src = ''} 
                    />
                </div>
                {/* Warna teks diambil dari config yang sudah diseragamkan */}
                <span className={`font-bold text-base ${currentSlide.color}`}>
                    {currentSlide.title}
                </span>
            </div>

            {/* --- 2. VISUAL AREA --- */}
            <div className="flex-1 flex items-center justify-between w-full my-2">
                <button 
                    onClick={prevDetail} 
                    className="p-2 hover:bg-gray-100 rounded-full text-[#2B3674]/50 hover:text-[#2B3674] transition-colors cursor-pointer shrink-0"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className={`w-full flex justify-center items-center px-2 ${currentSlide.scale}`}>
                    {currentSlide.component}
                </div>

                <button 
                    onClick={nextDetail} 
                    className="p-2 hover:bg-gray-100 rounded-full text-[#2B3674]/50 hover:text-[#2B3674] transition-colors cursor-pointer shrink-0"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* --- 3. FOOTER INFO --- */}
            <div className="mt-auto h-20 flex flex-col justify-end">
                {currentSlide.isRainChart ? (
                    <div className="flex justify-between text-[10px] text-[#A3AED0] font-bold uppercase tracking-wider px-4 w-full">
                        <span>10AM</span>
                        <span>11AM</span>
                        <span>12AM</span>
                        <span>01PM</span>
                        <span>02PM</span>
                        <span>03PM</span>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="text-2xl font-bold text-[#1B1B1E] mb-1">
                            {currentSlide.mainValue}
                        </div>
                        <p className="text-xs text-[#A3AED0] leading-relaxed line-clamp-2">
                            {currentSlide.desc}
                        </p>
                    </div>
                )}
            </div>

        </div>
      </StatCard>
    </div>
  );
}
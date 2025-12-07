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

  const UNIFIED_TITLE_COLOR = "text-[#345B92]";

  const slides = [
    {
      id: "visibility",
      title: "Visibility",
      color: UNIFIED_TITLE_COLOR,
      icon: "/images/Visibility_icon.svg",
      component: <VisibilityPyramid />,
      mainValue: "Visibility: 8 km",
      desc: "Jarak pandang baik untuk berkendara. Waspada terhadap sedikit haze.",
      scale: "scale-100" 
    },
    {
      id: "uv",
      title: "UV Index",
      color: UNIFIED_TITLE_COLOR,
      icon: "/images/UV_icon.svg",
      component: <UvGauge />,
      mainValue: "Sangat Tinggi",
      desc: "Stay inside.",
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

  return (
    <StatCard className="h-full relative overflow-hidden p-0!"> 
        {/* Container Utama */}
        <div className="flex flex-col h-full w-full p-6 relative">
            
            {/* --- NAVIGATION ARROWS (ABSOLUTE POSITION) --- */}
            {/* Tombol ini sekarang mengambang & terkunci posisinya, tidak akan ikut bergeser */}
            <button 
                onClick={prevDetail} 
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-[#2B3674]/40 hover:text-[#2B3674] transition-colors cursor-pointer"
            >
                <ChevronLeft size={24} /> {/* Ukuran diperkecil, tanpa bg */}
            </button>

            <button 
                onClick={nextDetail} 
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-[#2B3674]/40 hover:text-[#2B3674] transition-colors cursor-pointer"
            >
                <ChevronRight size={24} /> {/* Ukuran diperkecil, tanpa bg */}
            </button>


            {/* --- CONTENT AREA --- */}
            <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300 px-4"> {/* px-4 memberi jarak agar konten tidak kena arrow */}
                
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

                {/* Visual - Flexible Height */}
                <div className={`flex-1 flex justify-center items-center w-full overflow-visible ${currentSlide.scale}`}>
                    {currentSlide.component}
                </div>

                {/* Footer Info */}
                {/* Tinggi footer menyesuaikan: Hilang saat RainChart agar grafik bisa besar */}
                <div className={`mt-auto flex flex-col justify-end ${currentSlide.isRainChart ? 'min-h-0' : 'min-h-[60px]'}`}>
                    {currentSlide.isRainChart ? null : (
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

        </div>
    </StatCard>
  );
}
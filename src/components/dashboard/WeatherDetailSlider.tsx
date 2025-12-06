"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Sun, CloudRain } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { VisibilityPyramid, UvGauge, RainChart } from "@/components/dashboard/Visuals";

export default function WeatherDetailsSlider() {
  const [detailIndex, setDetailIndex] = useState(0);

  const nextDetail = () => setDetailIndex((prev) => (prev === 2 ? 0 : prev + 1));
  const prevDetail = () => setDetailIndex((prev) => (prev === 0 ? 2 : prev - 1));

  return (
    <div className="h-full flex flex-col">
      {/* Judul Bagian Luar (Sesuai Desain) */}
      <h2 className="text-xl font-bold text-[#1B2559] mb-4">Detail Cuaca Lainnya</h2>

      {/* Kartu Utama */}
      <StatCard className="h-full relative overflow-hidden">
        
        {/* SLIDE 1: VISIBILITY */}
        {detailIndex === 0 && (
          <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300">
            {/* Header: Icon & Title */}
            <div className="flex items-center gap-3 mb-2">
                <img src="/images/Visibility_icon.svg" alt="Visibility" className="w-6 h-6" onError={(e) => e.currentTarget.src = ''} />
                <span className="font-bold text-base text-[#1B1B1E]">Visibility</span>
            </div>

            {/* Visual Tengah Diapit Panah */}
            <div className="flex items-center justify-between grow my-2">
              <button onClick={prevDetail} className="text-[#2B3674]/50 hover:text-[#2B3674] p-1 transition-colors cursor-pointer">
                <ChevronLeft size={24} />
              </button>

              <div className="w-full max-w-40">
                <VisibilityPyramid />
              </div>

              <button onClick={nextDetail} className="text-[#2B3674]/50 hover:text-[#2B3674] p-1 transition-colors cursor-pointer">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Footer Text */}
            <div className="mt-auto">
              <div className="text-2xl font-bold text-[#1B1B1E] mb-1">Visibility: 8 km</div>
              <p className="text-xs text-[#A3AED0] leading-relaxed">
                Jarak pandang baik untuk berkendara. Waspada terhadap sedikit haze (kabut tipis) atau partikel udara.
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 2: UV INDEX */}
        {detailIndex === 1 && (
          <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <img src="/images/UV_icon.svg" alt="UV Index" className="w-6 h-6" onError={(e) => e.currentTarget.src = ''} />
                <span className="font-bold text-base text-[#4318FF]">UV Index</span>
            </div>

            {/* Visual Tengah */}
            <div className="flex items-center justify-between grow my-2">
              <button onClick={prevDetail} className="text-[#2B3674]/50 hover:text-[#2B3674] p-1 transition-colors cursor-pointer">
                <ChevronLeft size={24} />
              </button>

              <div className="scale-90">
                <UvGauge />
              </div>

              <button onClick={nextDetail} className="text-[#2B3674]/50 hover:text-[#2B3674] p-1 transition-colors cursor-pointer">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Footer Text */}
            <div className="mt-auto">
              <div className="text-2xl font-bold text-[#1B1B1E] mb-1">Sangat Tinggi</div>
              <p className="text-sm text-[#1B1B1E] font-medium">Stay inside.</p>
            </div>
          </div>
        )}

        {/* SLIDE 3: CURAH HUJAN */}
        {detailIndex === 2 && (
          <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <img src="/images/Curah_hujan_icon.svg" alt="Rain" className="w-6 h-6" onError={(e) => e.currentTarget.src = ''} />
                <span className="font-bold text-base text-[#4318FF]">Curah Hujan</span>
            </div>

            {/* Visual Tengah */}
            <div className="flex items-center justify-between grow my-2">
              <button onClick={prevDetail} className="text-[#2B3674]/50 hover:text-[#2B3674] p-1 transition-colors cursor-pointer">
                <ChevronLeft size={24} />
              </button>

              <div className="w-full px-2">
                <RainChart />
              </div>

              <button onClick={nextDetail} className="text-[#2B3674]/50 hover:text-[#2B3674] p-1 transition-colors cursor-pointer">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Footer Text / Labels */}
            <div className="mt-auto flex justify-between text-[10px] text-[#A3AED0] font-bold uppercase tracking-wider px-8">
              <span>10AM</span>
              <span>11AM</span>
              <span>12AM</span>
              <span>01PM</span>
              <span>02PM</span>
              <span>03PM</span>
            </div>
          </div>
        )}
      </StatCard>
    </div>
  );
}
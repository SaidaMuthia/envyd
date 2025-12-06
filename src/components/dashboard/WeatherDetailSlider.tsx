"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Sun, CloudRain } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
// Import visual baru dari file Visuals yang sudah diupdate
import { VisibilityPyramid, UvGauge, RainChart } from "@/components/dashboard/Visuals";

export default function WeatherDetailsSlider() {
  // State Slider: 0: Visibility, 1: UV Index, 2: Curah Hujan
  const [detailIndex, setDetailIndex] = useState(0);

  const nextDetail = () => setDetailIndex((prev) => (prev === 2 ? 0 : prev + 1));
  const prevDetail = () => setDetailIndex((prev) => (prev === 0 ? 2 : prev - 1));

  return (
    <div className="w-full">
      {/* Header Section dengan Indikator Dots */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1B2559]">Detail Cuaca Lainnya</h2>
        <div className="flex gap-2">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === detailIndex ? "bg-[#1B2559] w-6" : "bg-[#A3AED0]"
              }`}
              onClick={() => setDetailIndex(idx)}
            ></div>
          ))}
        </div>
      </div>

      {/* Container Slider */}
      <div className="w-full lg:max-w-lg transition-all duration-500 ease-in-out">
        
        {/* SLIDE 1: VISIBILITY */}
        {detailIndex === 0 && (
          <StatCard className="animate-in fade-in slide-in-from-right-4 duration-300 min-h-[350px]">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-full">
                    <Eye size={20} className="text-[#1B1B1E]" />
                </div>
                <span className="font-bold text-lg text-[#1B1B1E]">Visibility</span>
            </div>

            <div className="flex items-center justify-between w-full mb-6 gap-4">
              <button
                onClick={prevDetail}
                className="text-[#2B3674] hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="w-full px-4">
                <VisibilityPyramid />
              </div>

              <button
                onClick={nextDetail}
                className="text-[#2B3674] hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="text-center md:text-left mt-2">
              <div className="text-3xl font-bold text-[#1B1B1E] mb-2">Visibility: 8 km</div>
              <p className="text-sm text-[#A3AED0] leading-relaxed">
                Jarak pandang baik untuk berkendara. Waspada terhadap sedikit haze
                (kabut tipis) atau partikel udara.
              </p>
            </div>
          </StatCard>
        )}

        {/* SLIDE 2: UV INDEX */}
        {detailIndex === 1 && (
          <StatCard className="animate-in fade-in slide-in-from-right-4 duration-300 min-h-[350px]">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-full">
                    <Sun size={20} className="text-[#4318FF]" />
                </div>
                <span className="font-bold text-[#4318FF] text-lg">UV Index</span>
            </div>

            <div className="flex items-center justify-between w-full flex-1 gap-4">
              <button
                onClick={prevDetail}
                className="text-[#2B3674] hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex justify-center items-center py-4">
                <UvGauge />
              </div>

              <button
                onClick={nextDetail}
                className="text-[#2B3674] hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="mt-4 text-center md:text-left">
              <div className="text-2xl font-bold text-[#1B1B1E] mb-1">
                Sangat Tinggi
              </div>
              <p className="text-sm text-[#1B1B1E] font-medium">Stay inside.</p>
            </div>
          </StatCard>
        )}

        {/* SLIDE 3: CURAH HUJAN */}
        {detailIndex === 2 && (
          <StatCard className="animate-in fade-in slide-in-from-right-4 duration-300 min-h-[350px]">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-full">
                    <CloudRain size={20} className="text-[#4318FF]" />
                </div>
                <span className="font-bold text-[#4318FF] text-lg">
                    Curah Hujan
                </span>
            </div>

            <div className="flex items-center justify-between w-full flex-1 gap-4">
              <button
                onClick={prevDetail}
                className="text-[#2B3674] hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="w-full">
                <RainChart />
              </div>

              <button
                onClick={nextDetail}
                className="text-[#2B3674] hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex justify-between text-[10px] text-[#A3AED0] mt-4 px-12 font-bold uppercase tracking-widest">
              <span>10AM</span>
              <span>11AM</span>
              <span>12AM</span>
              <span>01PM</span>
              <span>02PM</span>
              <span>03PM</span>
            </div>
          </StatCard>
        )}
      </div>
    </div>
  );
}
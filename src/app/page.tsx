"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import WeatherMain from "@/components/dashboard/WeatherMain";
import AqiCard from "@/components/dashboard/AqiCard";
import ForecastRow from "@/components/dashboard/ForecastRow"; // Komponen baru
import { WindCompass, FeelsLikeSlider, HumidityBars, VisibilityPyramid } from "@/components/dashboard/Visuals";
import { Wind, Thermometer, Droplets, Eye, ArrowLeft } from "lucide-react";

// Import Map Dynamic
const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-gray-200 animate-pulse rounded-[30px]">Loading Map...</div>
});

export default function Home() {
  const [activeMode, setActiveMode] = useState<"forecast" | "aqi">("forecast");
  const [timeView, setTimeView] = useState<"today" | "tomorrow" | "next7">("today");
  const [isMapWide, setIsMapWide] = useState(false);

  // --- CONTENT RENDERERS ---

  // 1. Render Konten Kiri (Forecast / AQI / List 7 Hari)
  const renderMainContent = () => {
    // Jika Mode AQI
    if (activeMode === 'aqi') {
        return <AqiCard />;
    }

    // Jika Mode Forecast - Next 7 Days
    if (timeView === 'next7') {
        return (
            <div className="bg-white p-6 rounded-[30px] shadow-[0_20px_25px_-5px_rgba(112,144,176,0.1)] h-full min-h-60 flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
                <h3 className="font-bold text-[#2B3674] mb-2 px-2">Next 7 Days Forecast</h3>
                <ForecastRow day="Monday" condition="Sunny" temp={32} />
                <ForecastRow day="Tuesday" condition="Cloudy" temp={29} />
                <ForecastRow day="Wednesday" condition="Rainy" temp={27} />
                <ForecastRow day="Thursday" condition="Partly Cloudy" temp={30} />
                <ForecastRow day="Friday" condition="Sunny" temp={33} />
                <ForecastRow day="Saturday" condition="Rainy" temp={28} />
                <ForecastRow day="Sunday" condition="Sunny" temp={31} />
            </div>
        );
    }

    // Jika Mode Forecast - Today / Tomorrow (Struktur Grid Sama, Data Beda)
    const isTomorrow = timeView === 'tomorrow';
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full">
            {/* Card 1: Main Weather */}
            <div className="relative">
                {isTomorrow && <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] px-2 py-1 rounded-bl-xl rounded-tr-[30px] font-bold z-20">Tomorrow</div>}
                <WeatherMain />
            </div>

            {/* Card 2: Wind */}
            <StatCard 
            title="Wind" 
            icon={<Wind size={18} className="text-[#4318FF]"/>}
            footer={
                <div>
                    <p className="font-bold text-[#2B3674] text-sm">
                        {isTomorrow ? "18 km/h" : "16 km/h"} <span className="text-[#A3AED0] font-normal">| {isTomorrow ? "Barat Laut" : "Barat Daya"}</span>
                    </p>
                    <p className="text-[10px] text-[#A3AED0] mt-1 leading-tight">
                        {isTomorrow ? "Angin sedikit kencang, hati-hati." : "Kondisi baik untuk berlayar."}
                    </p>
                </div>
            }
            >
            <WindCompass />
            </StatCard>

            {/* Card 3: Feels Like */}
            <StatCard 
            title="Feels Like" 
            icon={<Thermometer size={18} className="text-[#4318FF]"/>}
            footer={
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-[#2B3674] text-sm">Feels like: {isTomorrow ? "28°" : "30°"}</p>
                    </div>
                    <p className="text-[10px] text-[#A3AED0] leading-tight">
                        {isTomorrow ? "Suhu sedikit lebih rendah dari hari ini." : "Terasa nyaman karena angin sejuk."}
                    </p>
                </div>
            }
            >
            <FeelsLikeSlider value={isTomorrow ? 28 : 30} />
            </StatCard>

            {/* Card 4: Humidity */}
            <StatCard 
            title="Humidity" 
            icon={<Droplets size={18} className="text-[#4318FF]"/>}
            footer={
                <div>
                    <p className="font-bold text-[#2B3674] text-sm">{isTomorrow ? "80%" : "71%"} <span className="text-[#A3AED0] font-normal">| Moderat</span></p>
                    <p className="text-[10px] text-[#A3AED0] mt-1 leading-tight">
                        {isTomorrow ? "Kelembaban meningkat besok." : "Udara terasa segar hari ini."}
                    </p>
                </div>
            }
            >
            <HumidityBars />
            </StatCard>
        </div>
    );
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-[1920px] mx-auto font-sans bg-[#F4F7FE] relative">
      
      {/* Overlay Mode Wide Map */}
      {isMapWide && (
        <div className="fixed inset-0 z-1000 bg-[#F4F7FE] p-6 flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setIsMapWide(false)} className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md font-bold text-[#2B3674] hover:bg-gray-100 transition">
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm font-bold text-[#2B3674]">
                    Makassar Wide View
                </div>
            </div>
            <div className="flex-1 rounded-[30px] overflow-hidden shadow-2xl border-4 border-white">
                <DashboardMap isExpanded={true} onExpand={() => setIsMapWide(false)} />
            </div>
        </div>
      )}

      <Header />

      {/* --- Navigation & Tabs --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-2 mt-6">
        <div className="flex gap-8 text-lg font-bold text-[#A3AED0] mb-4 md:mb-0">
          <button 
            onClick={() => setTimeView('today')}
            className={`transition px-1 pb-1 ${timeView === 'today' ? 'text-[#2B3674] border-b-2 border-[#2B3674]' : 'hover:text-[#2B3674]'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setTimeView('tomorrow')}
            className={`transition px-1 pb-1 ${timeView === 'tomorrow' ? 'text-[#2B3674] border-b-2 border-[#2B3674]' : 'hover:text-[#2B3674]'}`}
          >
            Tomorrow
          </button>
          <button 
            onClick={() => setTimeView('next7')}
            className={`transition px-1 pb-1 ${timeView === 'next7' ? 'text-[#4318FF] border-b-2 border-[#4318FF]' : 'hover:text-[#2B3674] text-[#4318FF]'}`}
          >
            Next 7 days
          </button>
        </div>

        {/* Toggle Pill */}
        <div className="bg-white p-1.5 rounded-full shadow-sm flex items-center">
          <button 
            onClick={() => setActiveMode("forecast")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeMode === 'forecast' ? 'bg-[#2B3674] text-white shadow-md' : 'text-[#A3AED0] hover:bg-gray-50'}`}
          >
            Forecast
          </button>
          <button 
            onClick={() => setActiveMode("aqi")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeMode === 'aqi' ? 'bg-[#2B3674] text-white shadow-md' : 'text-[#A3AED0] hover:bg-gray-50'}`}
          >
            Air Quality Index
          </button>
        </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        
        {/* LEFT SECTION (4 Columns) */}
        <div className="lg:col-span-4">
            {renderMainContent()}
        </div>

        {/* RIGHT SECTION (1 Column - Visibility) */}
        <div className="lg:col-span-1 h-full flex flex-col">
            <h3 className="text-lg font-bold text-[#2B3674] mb-4 ml-1">Detail Lainnya</h3>
            <div className="grow">
                <StatCard 
                    className="h-full"
                    title="Visibility" 
                    icon={<Eye size={18} className="text-[#2B3674]"/>}
                    footer={
                        <div>
                            <p className="font-bold text-[#2B3674] text-lg">8 km</p>
                            <p className="text-[10px] text-[#A3AED0] mt-2 leading-relaxed">
                                Jarak pandang baik. Waspada sedikit kabut tipis di pagi hari.
                            </p>
                        </div>
                    }
                >
                    <VisibilityPyramid />
                </StatCard>
            </div>
        </div>
      </div>

      {/* --- MAP SECTION --- */}
      <section className="mt-8">
        <h3 className="text-xl font-bold text-[#2B3674] mb-4">Map Overview</h3>
        <DashboardMap onExpand={() => setIsMapWide(true)} />
      </section>
    </main>
  );
}
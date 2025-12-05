"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import WeatherMain from "@/components/dashboard/WeatherMain";
import AqiCard from "@/components/dashboard/AqiCard";
import ForecastCard from "@/components/dashboard/ForecastCard"; // Komponen baru
import { WindCompass, FeelsLikeSlider, HumidityBars, VisibilityPyramid } from "@/components/dashboard/Visuals";
import { Wind, Thermometer, Droplets, Eye, ArrowLeft, X } from "lucide-react";

// Import Map secara Dynamic
const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-gray-200 animate-pulse rounded-[30px]">Loading Map...</div>
});

export default function Home() {
  const [activeMode, setActiveMode] = useState<"forecast" | "aqi">("forecast");
  const [timeView, setTimeView] = useState<"today" | "tomorrow" | "next7">("today");
  const [isMapWide, setIsMapWide] = useState(false);
  const [selectedForecastDay, setSelectedForecastDay] = useState<number | null>(null); // Untuk seleksi hari di Next 7

  // Data Mockup untuk Forecast
  const forecastData = [
    { day: "Tod", full: "Today", condition: "Sunny", temp: 32, rain: false },
    { day: "Mon", full: "Monday", condition: "Cloudy", temp: 32, rain: true },
    { day: "Tue", full: "Tuesday", condition: "Partly Cloudy", temp: 32, rain: true },
    { day: "Wed", full: "Wednesday", condition: "Sunny", temp: 32, rain: true },
    { day: "Thu", full: "Thursday", condition: "Partly Cloudy", temp: 32, rain: true },
    { day: "Fri", full: "Friday", condition: "Sunny", temp: 32, rain: true },
    { day: "Sat", full: "Saturday", condition: "Cloudy", temp: 32, rain: true },
  ] as const;

  // --- FUNGSI RENDER KONTEN ---

  const renderMainContent = () => {
    // 1. Tampilan AQI
    if (activeMode === 'aqi') {
        return <AqiCard />;
    }

    // 2. Tampilan Next 7 Days (Grid Kartu Vertikal)
    if (timeView === 'next7') {
        // Jika salah satu hari diklik, tampilkan detailnya (seperti Today view tapi datanya beda)
        if (selectedForecastDay !== null) {
            const dayData = forecastData[selectedForecastDay];
            return (
                 <div className="flex flex-col h-full gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setSelectedForecastDay(null)} className="p-2 bg-white rounded-full hover:bg-gray-100">
                            <ArrowLeft size={20} />
                        </button>
                        <h3 className="font-bold text-[#2B3674] text-xl">{dayData.full} Forecast</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full">
                        <WeatherMain /> {/* Anda bisa pass props data spesifik hari disini nanti */}
                        {renderCommonStats(dayData.condition === 'Sunny' ? 16 : 20, dayData.temp)}
                    </div>
                 </div>
            );
        }

        // Tampilan List Kartu (Default Next 7 Days)
        return (
            <div className="w-full h-full min-h-60 overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                    {forecastData.map((item, index) => (
                        <ForecastCard 
                            key={index}
                            day={item.day}
                            condition={item.condition}
                            temp={item.temp}
                            rainChance={item.rain ? 40 : undefined}
                            isActive={false}
                            onClick={() => setSelectedForecastDay(index)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // 3. Tampilan Today & Tomorrow (Layout Sama, Data Beda)
    const isTomorrow = timeView === 'tomorrow';
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full">
            {/* Card 1: Main Weather */}
            <div className="relative">
                {/* Kode badge Tomorrow sudah dihapus di sini */}
                <WeatherMain />
            </div>
            
            {/* Common Stats Cards */}
            {renderCommonStats(isTomorrow ? 18 : 16, isTomorrow ? 29 : 30)}
        </div>
    );
  };

  // Helper untuk render 3 kartu statistik (Wind, Feels Like, Humidity) agar tidak duplikasi kode
  const renderCommonStats = (windSpeed: number, feelsLike: number) => (
    <>
        {/* Wind */}
        <StatCard 
            title="Wind" 
            icon={<Wind size={18} className="text-[#4318FF]"/>}
            footer={
                <div>
                    <p className="font-bold text-[#2B3674] text-sm">{windSpeed} km/h <span className="text-[#A3AED0] font-normal">| Barat Daya</span></p>
                    <p className="text-[10px] text-[#A3AED0] mt-1 leading-tight">Kondisi baik untuk berlayar.</p>
                </div>
            }
        >
            <WindCompass />
        </StatCard>

        {/* Feels Like */}
        <StatCard 
            title="Feels Like" 
            icon={<Thermometer size={18} className="text-[#4318FF]"/>}
            footer={
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-[#2B3674] text-sm">Feels like {feelsLike}°</p>
                    </div>
                    <p className="text-[10px] text-[#A3AED0] leading-tight">Terasa nyaman karena angin sejuk.</p>
                </div>
            }
        >
            <FeelsLikeSlider value={feelsLike} />
        </StatCard>

        {/* Humidity */}
        <StatCard 
            title="Humidity" 
            icon={<Droplets size={18} className="text-[#4318FF]"/>}
            footer={
                <div>
                    <p className="font-bold text-[#2B3674] text-sm">71% <span className="text-[#A3AED0] font-normal">| Moderat</span></p>
                    <p className="text-[10px] text-[#A3AED0] mt-1 leading-tight">Udara terasa segar.</p>
                </div>
            }
        >
            <HumidityBars />
        </StatCard>
    </>
  );

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-[1920px] mx-auto font-sans bg-[#F4F7FE] relative">
      
      {/* --- WIDE MAP OVERLAY (Fixed) --- */}
      {isMapWide && (
        <div className="fixed inset-0 z-9999 bg-[#F4F7FE]/95 backdrop-blur-sm p-4 md:p-10 flex flex-col animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-full shadow-lg max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <ArrowLeft size={24} onClick={() => setIsMapWide(false)} className="cursor-pointer"/>
                    </div>
                    <span className="font-bold text-[#2B3674] text-lg">Wide Map View - Makassar</span>
                </div>
                <button onClick={() => setIsMapWide(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <X size={24} className="text-gray-500" />
                </button>
            </div>
            <div className="flex-1 w-full max-w-[90%] mx-auto rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative bg-gray-200">
                {/* Memaksa render ulang map saat wide mode agar layout Leaflet benar */}
                <DashboardMap isExpanded={true} onExpand={() => setIsMapWide(false)} />
            </div>
        </div>
      )}

      <Header />

      {/* --- Navigation & Tabs --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-2 mt-6">
        <div className="flex gap-8 text-lg font-bold text-[#A3AED0] mb-4 md:mb-0">
          <button 
            onClick={() => { setTimeView('today'); setSelectedForecastDay(null); }}
            className={`transition px-1 pb-1 ${timeView === 'today' ? 'text-[#2B3674] border-b-2 border-[#2B3674]' : 'hover:text-[#2B3674]'}`}
          >
            Today
          </button>
          <button 
            onClick={() => { setTimeView('tomorrow'); setSelectedForecastDay(null); }}
            className={`transition px-1 pb-1 ${timeView === 'tomorrow' ? 'text-[#2B3674] border-b-2 border-[#2B3674]' : 'hover:text-[#2B3674]'}`}
          >
            Tomorrow
          </button>
          <button 
            onClick={() => { setTimeView('next7'); setSelectedForecastDay(null); }}
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
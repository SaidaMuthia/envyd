"use client";

import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import WeatherMain from "@/components/dashboard/WeatherMain";
import AqiCard from "@/components/dashboard/AqiCard";
import WeatherDetailsSlider from "@/components/dashboard/WeatherDetailSlider";

// Visuals & Icons
import { WindCompass, FeelsLikeSlider, HumidityBars } from "@/components/dashboard/Visuals";
import { Wind, ArrowLeft, X, Sun, Cloud, CloudRain, CloudSun } from "lucide-react";
import { useLocation } from "@/context/LocationContext"; // IMPORT CONTEXT

// Import Map
const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-gray-200 animate-pulse rounded-[30px]">Loading Map...</div>
});

export default function Home() {
  const { forecast, loading } = useLocation(); // <--- GANTI DISINI
  
  const [activeMode, setActiveMode] = useState<"forecast" | "aqi">("forecast");
  const [timeView, setTimeView] = useState<"today" | "tomorrow" | "next2">("today");
  const [isMapWide, setIsMapWide] = useState(false);
  const [selectedForecastDay, setSelectedForecastDay] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- KITA PAKAI DATA DARI CONTEXT (forecast), BUKAN HARDCODE ---
  // Jika masih loading, kita pakai array kosong atau dummy agar tidak error saat render
  const safeForecast = (loading || forecast.length === 0) ? [] : forecast;

  const handleTabChange = (view: "today" | "tomorrow" | "next2") => {
    setTimeView(view);
    if (view === 'next2') setSelectedForecastDay(0);
  };

  const handleModeChange = (mode: "forecast" | "aqi") => {
    setActiveMode(mode);
    // PERBAIKAN: Jika pindah ke AQI, reset ke Today jika sedang di Tomorrow atau Next2
    if (mode === 'aqi' && (timeView === 'next2' || timeView === 'tomorrow')) {
        setTimeView('today');
    }
  };

  const getIcon = (condition: string, size: number = 64) => {
    const c = (condition || "").toLowerCase();
    if (c.includes("sun") || c.includes("clear")) return <Sun size={size} className="text-yellow-400 fill-yellow-400" />;
    else if (c.includes("partly") || c.includes("cloud") && c.includes("sun")) return <CloudSun size={size} className="text-yellow-400" />;
    else if (c.includes("rain") || c.includes("drizzle")) return <CloudRain size={size} className="text-blue-400 fill-blue-50" />;
    else if (c.includes("cloud")) return <Cloud size={size} className="text-gray-400 fill-gray-100" />;
    else return <Sun size={size} className="text-yellow-400 fill-yellow-400" />;
  };

  const handleCardClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedForecastDay(index);
    if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const card = e.currentTarget;
        const scrollLeft = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  // --- RENDER FUNCTIONS (TIDAK UBAH DESAIN) ---
  const renderStandardDashboard = () => {
    if (loading || safeForecast.length === 0) return <div className="p-10 text-center">Loading Data...</div>;

    const isTomorrow = timeView === 'tomorrow';
    // Ambil index 0 (hari ini) atau 1 (besok) dari data API
    const data = isTomorrow ? (safeForecast[1] || safeForecast[0]) : safeForecast[0];
    const title = isTomorrow ? "Tomorrow" : "Today";

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full min-h-[280px]">
         <div className="h-full">
            <WeatherMain 
               title={title} 
               temp={data.temp} 
               condition={data.condition}
               low={data.low}
               high={data.high}
            />
         </div>
         <StatCard 
            icon={<img src="/images/Wind_icon.svg" alt="Wind" className="w-5 h-5" />}
            title="Wind"
            footer={
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-xl font-bold text-[#1B1B1E]">{data.wind}</span>
                        <span className="text-sm font-bold text-[#1B1B1E]">km/h</span>   
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                         <span className="text-sm font-semibold text-[#1B1B1E]">Arah:</span>
                         <span className="text-sm font-bold text-blue-600">{data.windDir}</span> {/* Menggunakan data.windDir */}
                     </div>
                    <p className="text-[10px] text-[#A3AED0] font-medium leading-tight">Kecepatan angin saat ini.</p>
                </div>
            }
         >
            <div className="mt-2 flex justify-center w-full"><WindCompass /></div>
         </StatCard>
         <StatCard 
            icon={<img src="/images/Feels_like_icon.svg" alt="Feels Like" className="w-5 h-5" />}
            title="Feels Like"
            footer={
                <div className="mt-auto w-full">
                     <div className="flex justify-between items-end mb-1 text-[#1B1B1E]">
                        <span className="text-xs font-bold">Feels like: {data.feelsLike}°</span>
                        <span className="text-xs font-bold">Temp: {data.temp}°</span>
                     </div>
                     <p className="text-[10px] text-[#A3AED0] font-medium leading-tight">Udara terasa {data.feelsLike > data.temp ? "lebih panas" : "lebih dingin"}.</p>
                </div>
            }
         >
            <div className="w-full mt-2 mb-2"><FeelsLikeSlider value={data.feelsLike} /></div>
         </StatCard>
         <StatCard 
            icon={<img src="/images/Humidity_icon.svg" alt="Humidity" className="w-5 h-5" />}
            title="Humidity"
            footer={
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-xl font-bold text-[#1B1B1E]">{data.humidity}</span>
                        <span className="text-sm font-bold text-[#1B1B1E]">%</span>
                    </div>
                    <p className="text-[10px] text-[#A3AED0] font-medium leading-tight">Kelembapan udara.</p>
                </div>
            }
         >
            <div className="mt-3 mb-1 w-full"><HumidityBars /></div>
         </StatCard>
      </div>
    );
  };

  const renderNext2Days = () => {
    return (
      <div 
        ref={scrollContainerRef}
        className="w-full elegant-scrollbar px-1 pt-1 h-full min-h-[280px] flex items-center pr-4"
      >
        <div className="flex gap-4 h-full min-w-max">
            {/* Ganti forecastData dengan safeForecast (Data API) */}
            {safeForecast.map((item, index) => {
                const isSelected = selectedForecastDay === index;
                return (
                    <div 
                        key={index}
                        onClick={(e) => handleCardClick(index, e)}
                        className={`
                            relative rounded-[30px] p-5 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer shadow-sm border border-transparent
                            flex flex-col overflow-hidden h-full 
                            ${isSelected 
                                ? 'w-[320px] bg-white ring-2 ring-blue-50 z-10' 
                                : 'w-[110px] bg-[#E5F0FF] hover:bg-white hover:shadow-md'
                            }
                        `}
                    >
                        {isSelected ? (
                            <div className="flex flex-col h-full w-full animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                                <div className="flex justify-between items-start w-full">
                                    <h3 className="text-2xl font-bold text-[#1B1B1E] border-b-2 border-[#1B1B1E] pb-1 whitespace-nowrap">{item.full}</h3>
                                    <span className="text-xs font-bold text-[#A3AED0] mt-1.5 ml-2">12:00 PM</span>
                                </div>
                                <div className="flex-1 flex items-center justify-start pl-4 py-2">{getIcon(item.condition, 72)}</div>
                                <div className="flex items-end justify-between mt-auto w-full">
                                    <div>
                                        <span className="text-5xl font-bold text-[#1B1B1E] tracking-tighter">{item.temp}°</span>
                                        <div className="text-xs font-bold text-[#A3AED0] mt-1">Low: {item.low}° <br/> High: {item.high}°</div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center text-[10px] font-medium text-[#1B1B1E] bg-gray-50 px-3 py-2 rounded-xl min-w-[100px] gap-1.5 shadow-sm">
                                        <p>Wind: {item.wind} km/h</p>
                                        <p>Feels: {item.feelsLike}°</p>
                                        <p>Hum: {item.humidity}%</p>
                                        <p>Vis: {item.visibility} km</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                           <div className="flex flex-col justify-between h-full items-center w-full animate-in fade-in duration-500">
                                <div className="w-full flex justify-center"><span className="text-xl font-bold text-[#1B1B1E] border-b-2 border-[#1B1B1E] pb-1">{item.day}</span></div>
                                <div className="flex flex-col items-center gap-2 flex-1 justify-center"><div className="drop-shadow-sm scale-90">{getIcon(item.condition, 48)}</div></div>
                                <div className="text-4xl font-medium text-[#1B1B1E] text-center mb-2">{item.temp}°</div>
                           </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-[1920px] mx-auto font-sans bg-[#F4F7FE] relative text-[#1B2559]">
      {/* Map Overlay */}
      {isMapWide && (
        // ... (Kode overlay map asli) ...
        <div className="fixed inset-0 z-9999 bg-[#F4F7FE]/95 backdrop-blur-sm p-4 md:p-10 flex flex-col animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-full shadow-lg max-w-4xl mx-auto w-full">
                <button onClick={() => setIsMapWide(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={24}/></button>
                <span className="font-bold text-[#2B3674] text-lg">Wide Map View</span>
                <button onClick={() => setIsMapWide(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={24}/></button>
            </div>
            <div className="flex-1 w-full max-w-[90%] mx-auto rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative bg-gray-200">
                <DashboardMap isExpanded={true} onExpand={() => setIsMapWide(false)} />
            </div>
        </div>
      )}

      <Header />
      
<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 px-1 mt-8 items-end">
        <div className="lg:col-span-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-8 text-lg font-bold">
              {/* TOMBOL TODAY (Selalu Ada) */}
              <button 
                onClick={() => handleTabChange('today')} 
                className={`transition px-1 pb-1 ${timeView === 'today' ? 'text-[#1B2559] border-b-2 border-[#1B2559]' : 'text-[#A3AED0] hover:text-[#1B2559]'}`}
              >
                Today
              </button>

              {/* TOMBOL TOMORROW (Hanya di mode Forecast) */}
              {activeMode === 'forecast' && (
                <button 
                    onClick={() => handleTabChange('tomorrow')} 
                    className={`transition px-1 pb-1 ${timeView === 'tomorrow' ? 'text-[#1B2559] border-b-2 border-[#1B2559]' : 'text-[#A3AED0] hover:text-[#1B2559]'}`}
                >
                    Tomorrow
                </button>
              )}
              
              {/* TOMBOL NEXT 2 DAYS (Hanya di mode Forecast) */}
              {activeMode === 'forecast' && (
                  <button 
                    onClick={() => handleTabChange('next2')} 
                    className={`transition px-1 pb-1 ${timeView === 'next2' ? 'text-[#1B1B1E] border-b-2 border-[#1B1B1E]' : 'text-[#A3AED0] hover:text-[#1B2559]'}`}
                  >
                    Next 2 days
                  </button>
              )}
            </div>

            <div className="bg-white p-1 rounded-full shadow-sm flex items-center">
              <button onClick={() => handleModeChange("forecast")} className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeMode === 'forecast' ? 'bg-[#1B1B1E] text-white' : 'bg-transparent text-[#A3AED0]'}`}>Forecast</button>
              <button onClick={() => handleModeChange("aqi")} className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeMode === 'aqi' ? 'bg-[#1B1B1E] text-white' : 'bg-transparent text-[#A3AED0]'}`}>Air Quality Index</button>
            </div>
        </div>
        <div className="lg:col-span-1 hidden lg:flex items-center pb-2">
            <h2 className="text-xl font-bold text-[#1B2559]">Detail Cuaca Lainnya</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 min-h-[280px]">
        <div className="lg:col-span-4 h-full">
            {activeMode === 'aqi' ? <AqiCard /> : (timeView === 'next2' ? renderNext2Days() : renderStandardDashboard())}
        </div>
        <div className="lg:col-span-1 h-full min-h-[280px] flex flex-col">
            <h2 className="text-xl font-bold text-[#1B2559] mb-4 lg:hidden">Detail Cuaca Lainnya</h2>
            <div className="flex-1 h-full"><WeatherDetailsSlider /></div>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-xl font-bold text-[#1B2559] mb-4">Map Overview</h3>
        <DashboardMap onExpand={() => setIsMapWide(true)} />
      </section>
    </main>
  );
}
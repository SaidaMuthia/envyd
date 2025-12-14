"use client";

import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import WeatherMain from "@/components/dashboard/WeatherMain";
import AqiCard from "@/components/dashboard/AqiCard";
import WeatherDetailsSlider from "@/components/dashboard/WeatherDetailSlider";

import { WindCompass, FeelsLikeSlider, HumidityBars } from "@/components/dashboard/Visuals";
import { Wind, ArrowLeft, X, Sun, Cloud, CloudRain, CloudSun } from "lucide-react";
import { useLocation } from "@/context/LocationContext";

const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-gray-200 animate-pulse rounded-[30px]">Loading Map...</div>
});

const FullInteractiveMap = dynamic(() => import("@/components/map/FullInteractiveMap"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#F4F7FE] z-2000 flex items-center justify-center text-[#2B3674] font-bold">Loading Map...</div>
});

export default function Home() {
  const { forecast, weather, loading, activeLocation, setActiveLocation } = useLocation();
  
  const [activeMode, setActiveMode] = useState<"forecast" | "aqi">("forecast");
  const [timeView, setTimeView] = useState<"today" | "tomorrow" | "next2">("today");
  const [isMapWide, setIsMapWide] = useState(false);
  const [expandedDays, setExpandedDays] = useState<number[]>([0]); 

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const safeForecast = (loading || forecast.length === 0) ? [] : forecast;

    const handleMapLocationSelect = (lat: number, lng: number) => {
        // 1. Update Context dengan koordinat baru (ini akan memicu fetch data baru)
        setActiveLocation({
            name: `Lokasi Peta (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
            lat: lat,
            lng: lng,
            adm4: "" // Set adm4 kosong untuk memicu Reverse Geocoding di backend
        });
        
        // 2. Reset tampilan ke "Today" dan mode "Forecast"
        setTimeView("today");
        setActiveMode("forecast"); 
    };

  const handleTabChange = (view: "today" | "tomorrow" | "next2") => {
    setTimeView(view);
    if (view === 'next2') setExpandedDays([0]); 
  };

  const handleModeChange = (mode: "forecast" | "aqi") => {
    setActiveMode(mode);
    if (mode === 'aqi' && (timeView === 'next2' || timeView === 'tomorrow')) {
        setTimeView('today');
    }
  };

  const toggleDayCard = (index: number) => {
    setExpandedDays(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const getIcon = (condition: string, size: number = 64) => {
    const c = (condition || "").toLowerCase();
    if (c.includes("sun") || c.includes("clear")) return <Sun size={size} className="text-yellow-400 fill-yellow-400" />;
    else if (c.includes("partly") || c.includes("cloud") && c.includes("sun")) return <CloudSun size={size} className="text-yellow-400" />;
    else if (c.includes("rain") || c.includes("drizzle")) return <CloudRain size={size} className="text-blue-400 fill-blue-50" />;
    else if (c.includes("cloud")) return <Cloud size={size} className="text-gray-400 fill-gray-100" />;
    else return <Sun size={size} className="text-yellow-400 fill-yellow-400" />;
  };

  // Label Tab Dinamis
  const todayLabel = safeForecast[0] && safeForecast[0].dateDisplay !== "-" ? `Today, ${safeForecast[0].dateDisplay}` : "Today";
  const tomorrowLabel = safeForecast[1] && safeForecast[1].dateDisplay !== "-" ? `Tomorrow, ${safeForecast[1].dateDisplay}` : "Tomorrow";
  const next2Label = (safeForecast[2] && safeForecast[3]) ? `${safeForecast[2].day} - ${safeForecast[3].day}` : "Next 2 days";

  // Render functions
  const renderStandardDashboard = () => {
    if (loading && !weather) return <div className="p-10 text-center">Loading Data...</div>;

    const isTomorrow = timeView === 'tomorrow';
    
    // Logic Data
    let data: any = {};
    if (isTomorrow) {
        data = safeForecast[1] || safeForecast[0] || {};
    } else {
        if (weather) {
            data = {
                ...weather,
                wind: weather.windSpeed, 
                full: "Today",
                dateDisplay: safeForecast[0]?.dateDisplay || "-" 
            };
        } else {
            data = safeForecast[0] || {};
        }
    }

    const title = isTomorrow ? (data.full || "Tomorrow") : (data.full || "Today");

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
                         <span className="text-sm font-bold text-blue-600">{data.windDir}</span>
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
        className="w-full h-full min-h-[280px] overflow-x-auto pb-2 px-1 scrollbar-hide"
      >
        <div className="flex gap-4 h-full min-w-max">
            {safeForecast.map((item, index) => {
                const isSelected = expandedDays.includes(index);
                return (
                    <div 
                        key={index}
                        onClick={() => toggleDayCard(index)}
                        className={`
                            relative rounded-[30px] p-5 transition-all duration-300 ease-in-out cursor-pointer shadow-sm border border-transparent
                            flex flex-col overflow-hidden h-full shrink-0
                            ${isSelected 
                                ? 'w-[420px] bg-white ring-2 ring-blue-50 z-10 shadow-md' 
                                : 'w-[100px] bg-[#E5F0FF] hover:bg-white hover:shadow-md' 
                            }
                        `}
                    >
                        {isSelected ? (
                            <div className="flex h-full w-full animate-in fade-in duration-300 gap-4">
                                <div className="flex flex-col justify-between w-1/2">
                                    <div className="flex justify-between items-start w-full">
                                        <h3 className="text-xl font-bold text-[#1B1B1E] border-b-2 border-[#1B1B1E] pb-1 whitespace-nowrap">{item.day}</h3>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div className="transform scale-100">{getIcon(item.condition, 64)}</div>
                                        <div className="text-center">
                                            <span className="text-4xl font-bold text-[#1B1B1E] tracking-tighter block">{item.temp}°</span>
                                            <span className="text-xs text-[#A3AED0] font-medium">{item.condition}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2 bg-[#F4F7FE] rounded-2xl p-4 flex flex-col justify-center gap-3 h-full shadow-inner">
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2"><span className="text-[10px] text-[#A3AED0] font-bold uppercase">Temp</span><span className="text-xs font-bold text-[#1B2559]">{item.low}° - {item.high}°</span></div>
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2"><span className="text-[10px] text-[#A3AED0] font-bold uppercase">Wind</span><span className="text-xs font-bold text-[#1B2559]">{item.wind} km</span></div>
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2"><span className="text-[10px] text-[#A3AED0] font-bold uppercase">Humid</span><span className="text-xs font-bold text-[#1B2559]">{item.humidity}%</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[10px] text-[#A3AED0] font-bold uppercase">Feels</span><span className="text-xs font-bold text-[#1B2559]">{item.feelsLike}°</span></div>
                                </div>
                            </div>
                        ) : (
                           <div className="flex flex-col justify-between h-full items-center w-full animate-in fade-in duration-500 py-2">
                                <div className="w-full flex justify-center"><span className="text-xl font-bold text-[#1B1B1E] border-b-2 border-[#1B1B1E] pb-1">{item.day}</span></div>
                                <div className="flex flex-col items-center gap-2 flex-1 justify-center"><div className="drop-shadow-sm scale-90 opacity-90">{getIcon(item.condition, 48)}</div></div>
                                <div className="text-3xl font-medium text-[#1B1B1E] text-center mb-2">{item.temp}°</div>
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
      {isMapWide && (
        <FullInteractiveMap onClose={() => setIsMapWide(false)} />
      )}
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 px-1 mt-8 items-end">
        <div className="lg:col-span-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-8 text-lg font-bold">
              <button onClick={() => handleTabChange('today')} className={`transition px-1 pb-1 ${timeView === 'today' ? 'text-[#1B2559] border-b-2 border-[#1B2559]' : 'text-[#A3AED0] hover:text-[#1B2559]'}`}>
                  {todayLabel}
              </button>
              {activeMode === 'forecast' && (
                <button onClick={() => handleTabChange('tomorrow')} className={`transition px-1 pb-1 ${timeView === 'tomorrow' ? 'text-[#1B2559] border-b-2 border-[#1B2559]' : 'text-[#A3AED0] hover:text-[#1B2559]'}`}>
                    {tomorrowLabel}
                </button>
              )}
              {activeMode === 'forecast' && (
                  <button onClick={() => handleTabChange('next2')} className={`transition px-1 pb-1 ${timeView === 'next2' ? 'text-[#1B1B1E] border-b-2 border-[#1B1B1E]' : 'text-[#A3AED0] hover:text-[#1B2559]'}`}>
                      {next2Label}
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
        <DashboardMap onExpand={() => setIsMapWide(true)}
        onLocationSelect={handleMapLocationSelect} />
      </section>
    </main>
  );
}
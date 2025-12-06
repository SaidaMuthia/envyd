"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import WeatherMain from "@/components/dashboard/WeatherMain";
import AqiCard from "@/components/dashboard/AqiCard";
import ForecastCard from "@/components/dashboard/ForecastCard";
// Import Slider Component
import WeatherDetailsSlider from "@/components/dashboard/WeatherDetailSlider";

// Visuals & Icons
import { WindCompass, FeelsLikeSlider, HumidityBars } from "@/components/dashboard/Visuals";
import { Wind, Thermometer, Droplets, ArrowLeft, X } from "lucide-react";

// Import Map secara Dynamic
const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-gray-200 animate-pulse rounded-[30px]">Loading Map...</div>
});

export default function Home() {
  const [activeMode, setActiveMode] = useState<"forecast" | "aqi">("forecast");
  const [timeView, setTimeView] = useState<"today" | "tomorrow" | "next7">("today");
  const [isMapWide, setIsMapWide] = useState(false);
  const [selectedForecastDay, setSelectedForecastDay] = useState<number | null>(null);

  // Data Mockup Forecast
  const forecastData = [
    { day: "Tod", full: "Today", condition: "Sunny", temp: 32, rain: false },
    { day: "Mon", full: "Monday", condition: "Cloudy", temp: 32, rain: true },
    { day: "Tue", full: "Tuesday", condition: "Partly Cloudy", temp: 32, rain: true },
    { day: "Wed", full: "Wednesday", condition: "Sunny", temp: 32, rain: true },
    { day: "Thu", full: "Thursday", condition: "Partly Cloudy", temp: 32, rain: true },
    { day: "Fri", full: "Friday", condition: "Sunny", temp: 32, rain: true },
    { day: "Sat", full: "Saturday", condition: "Cloudy", temp: 32, rain: true },
  ] as const;

  const renderMainContent = () => {
    // 1. Tampilan AQI
    if (activeMode === 'aqi') {
        return <AqiCard />;
    }

    // 2. Tampilan Next 7 Days (Grid Kartu Horizontal)
    if (timeView === 'next7' && selectedForecastDay === null) {
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

    // 3. Tampilan Today & Tomorrow (Layout 5 Kolom)
    const mainTitle = timeView === 'tomorrow' ? "Tomorrow" : "Today";
    const displayTitle = selectedForecastDay !== null ? forecastData[selectedForecastDay].full : mainTitle;

    return (
        <div className="flex flex-col gap-6">
            
            {/* Tombol Back jika sedang melihat detail dari Next 7 Days */}
            {selectedForecastDay !== null && (
               <button onClick={() => setSelectedForecastDay(null)} className="flex items-center gap-2 text-[#2B3674] font-bold hover:underline w-fit">
                  <ArrowLeft size={20} /> Back to 7 Days
               </button>
            )}

            {/* MAIN GRID: 5 KOLOM (Sesuai Desain) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                
                {/* KOLOM 1: MAIN WEATHER */}
                <div className="h-full">
                    <WeatherMain title={displayTitle} />
                </div>

                {/* KOLOM 2: WIND */}
                <StatCard 
                    icon={<Wind size={20} className="text-[#A3AED0]" />}
                    title="Wind"
                    footer={
                        <div className="mt-2">
                            <div className="text-lg font-bold text-[#1B1B1E] mb-1">16 km/h <span className="text-sm font-normal text-[#A3AED0]">dari Barat Daya</span></div>
                            <p className="text-[10px] text-[#A3AED0] leading-relaxed">
                                Kondisi baik untuk berlayar dan suasana pantai yang sejuk.
                            </p>
                        </div>
                    }
                >
                    <WindCompass /> 
                </StatCard>

                {/* KOLOM 3: FEELS LIKE */}
                <StatCard 
                    icon={<Thermometer size={20} className="text-[#A3AED0]" />}
                    title="Feels Like"
                    footer={
                        <div className="mt-4">
                            <div className="flex justify-between items-center text-sm font-bold text-[#1B1B1E] mb-1">
                                <span>Feels like: 30°</span>
                                <span>Temp: 30°</span>
                            </div>
                            <p className="text-[10px] text-[#A3AED0] leading-relaxed">
                                Meskipun suhu aktual tinggi, kombinasi angin membuat udara terasa lebih nyaman.
                            </p>
                        </div>
                    }
                >
                    <FeelsLikeSlider value={30} />
                </StatCard>

                {/* KOLOM 4: HUMIDITY */}
                <StatCard 
                    icon={<Droplets size={20} className="text-[#A3AED0]" />}
                    title="Humidity"
                    footer={
                        <div className="mt-2">
                            <div className="text-lg font-bold text-[#1B1B1E] mb-1">Humidity: 71%</div>
                            <p className="text-[10px] text-[#A3AED0] leading-relaxed">
                                Tingkat kelembapan moderat 71. Udara terasa segar.
                            </p>
                        </div>
                    }
                >
                    <HumidityBars />
                </StatCard>

                {/* KOLOM 5: DETAIL CUACA LAINNYA (SLIDER) */}
                <div className="h-full">
                    <WeatherDetailsSlider />
                </div>
            </div>
        </div>
    );
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-[1920px] mx-auto font-sans bg-[#F4F7FE] relative text-[#1B2559]">
      
      {/* WIDE MAP OVERLAY */}
      {isMapWide && (
        <div className="fixed inset-0 z-9999 bg-[#F4F7FE]/95 backdrop-blur-sm p-4 md:p-10 flex flex-col animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-full shadow-lg max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <ArrowLeft size={24} onClick={() => setIsMapWide(false)} className="cursor-pointer"/>
                    </div>
                    <span className="font-bold text-[#2B3674] text-lg">Wide Map View</span>
                </div>
                <button onClick={() => setIsMapWide(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <X size={24} className="text-gray-500" />
                </button>
            </div>
            <div className="flex-1 w-full max-w-[90%] mx-auto rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative bg-gray-200">
                <DashboardMap isExpanded={true} onExpand={() => setIsMapWide(false)} />
            </div>
        </div>
      )}

      <Header />

      {/* Navigation & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-2 mt-6 gap-4">
        <div className="flex gap-8 text-lg font-bold mb-4 md:mb-0">
          <button 
            onClick={() => { setTimeView('today'); setSelectedForecastDay(null); }}
            className={`transition px-1 pb-1 ${timeView === 'today' && selectedForecastDay === null ? 'text-[#1B2559] border-b-2 border-[#1B2559]' : 'text-[#A3AED0] hover:text-[#1B2559]'}`}
          >
            Today
          </button>
          <button 
            onClick={() => { setTimeView('tomorrow'); setSelectedForecastDay(null); }}
            className={`transition px-1 pb-1 ${timeView === 'tomorrow' ? 'text-[#1B2559] border-b-2 border-[#1B2559]' : 'text-[#A3AED0] hover:text-[#1B2559]'}`}
          >
            Tomorrow
          </button>
          <button 
            onClick={() => { setTimeView('next7'); setSelectedForecastDay(null); }}
            className={`transition px-1 pb-1 ${timeView === 'next7' ? 'text-[#4318FF] border-b-2 border-[#4318FF]' : 'text-[#A3AED0] hover:text-[#1B2559]'}`}
          >
            Next 7 days
          </button>
        </div>

        <div className="bg-white p-1 rounded-full shadow-sm flex items-center">
          <button 
            onClick={() => setActiveMode("forecast")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeMode === 'forecast' ? 'bg-[#1B1B1E] text-white' : 'bg-transparent text-[#A3AED0] hover:bg-gray-50'}`}
          >
            Forecast
          </button>
          <button 
            onClick={() => setActiveMode("aqi")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeMode === 'aqi' ? 'bg-[#1B1B1E] text-white' : 'bg-transparent text-[#A3AED0] hover:bg-gray-50'}`}
          >
            Air Quality Index
          </button>
        </div>
      </div>

      <div className="mb-12">
        {renderMainContent()}
      </div>

      <section className="mt-8">
        <h3 className="text-xl font-bold text-[#2B3674] mb-4">Map Overview</h3>
        <DashboardMap onExpand={() => setIsMapWide(true)} />
      </section>
    </main>
  );
}
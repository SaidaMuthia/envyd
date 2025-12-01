"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import { WindCompass, FeelsLikeSlider, HumidityBars, VisibilityPyramid } from "@/components/dashboard/Visuals";
import { Wind, Thermometer, Droplets, CloudSun, Eye } from "lucide-react";

// Import Map secara Dynamic
const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-gray-200 animate-pulse rounded-[2.5rem]">Loading Map...</div>
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<"forecast" | "aqi">("forecast");

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-[1920px] mx-auto font-sans">
      <Header />

      {/* --- Navigation Row --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-2">
        <div className="flex gap-8 text-lg font-bold text-gray-400 mb-4 md:mb-0">
          <button className="text-gray-800 border-b-2 border-black pb-1">Today</button>
          <button className="hover:text-gray-600 transition">Tomorrow</button>
          <button className="hover:text-gray-600 transition text-blue-600">Next 7 days</button>
        </div>

        {/* Toggle Pill */}
        <div className="bg-white p-1.5 rounded-full shadow-sm flex items-center border border-gray-100">
          <button 
            onClick={() => setActiveTab("forecast")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'forecast' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            Forecast
          </button>
          <button 
            onClick={() => setActiveTab("aqi")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'aqi' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            Air Quality Index
          </button>
        </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        
        {/* KOLOM KIRI (4 Columns Span) */}
        <div className="lg:col-span-4">
          {activeTab === 'aqi' ? (
            /* --- MODE AQI (Single Wide Card) --- */
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm w-full h-full min-h-60 flex flex-col justify-between border border-white">
               <div className="flex items-center gap-2 text-gray-500 mb-4">
                 <Wind size={20} className="text-blue-500" />
                 <span className="font-bold text-sm text-gray-500">Air Quality Index</span>
               </div>

               <div className="relative w-full h-4 rounded-full bg-linear-to-r from-green-400 via-yellow-400 to-purple-600 my-4">
                 <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-6 h-6 bg-white border-4 border-yellow-300 rounded-full shadow-lg z-10"></div>
               </div>

               <div className="flex flex-col md:flex-row justify-between items-end mt-4">
                 <div>
                    <h2 className="text-7xl font-bold text-gray-800 leading-none tracking-tight">65</h2>
                    <span className="text-gray-800 font-bold text-xl ml-1 block mt-2">Good</span>
                 </div>
                 <div className="max-w-md text-right mt-4 md:mt-0">
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        Air quality is satisfactory, and air pollution poses little or no risk. 
                    </p>
                    <p className="text-xs text-gray-400 mt-1">(Air quality powered by Breezometer)</p>
                 </div>
               </div>
               <p className="text-[10px] text-gray-300 mt-4">Data from Station X</p>
            </div>
          ) : (
            /* --- MODE FORECAST (4 Grid Cards) --- */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full">
              
              {/* Card 1: Today Main */}
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between h-full min-h-60">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-800">Today</h2>
                  <span className="text-gray-800 text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">12:00 PM</span>
                </div>
                <div className="flex flex-col items-center justify-center grow py-2">
                   <CloudSun size={72} className="text-yellow-400 drop-shadow-md" />
                </div>
                <div className="flex items-end justify-between mt-2">
                  <h1 className="text-5xl font-bold text-gray-800 tracking-tight">32°</h1>
                  <div className="text-right text-gray-400 text-xs font-bold space-y-1">
                    <p>Low: 28°</p>
                    <p>High: 34°</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Wind */}
              <StatCard 
                title="Wind" 
                icon={<Wind size={18} className="text-blue-500"/>}
                footer={
                    <div>
                        <p className="font-bold text-gray-800 text-sm">16 km/h dari Barat Daya</p>
                        <p className="text-[10px] text-gray-400 mt-1 leading-tight">Kondisi baik untuk berlayar dan suasana pantai yang sejuk.</p>
                    </div>
                }
              >
                <WindCompass />
              </StatCard>

              {/* Card 3: Feels Like */}
              <StatCard 
                title="Feels Like" 
                icon={<Thermometer size={18} className="text-blue-500"/>}
                footer={
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-bold text-gray-800 text-sm">Feels like: 30°</p>
                            <p className="font-bold text-gray-800 text-sm">Temp: 30°</p>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-tight">Meskipun suhu aktual tinggi, kombinasi angin membuatnya terasa nyaman.</p>
                    </div>
                }
              >
                <FeelsLikeSlider value={30} />
              </StatCard>

              {/* Card 4: Humidity */}
              <StatCard 
                title="Humidity" 
                icon={<Droplets size={18} className="text-blue-500"/>}
                footer={
                    <div>
                        <p className="font-bold text-gray-800 text-sm">Humidity: 71%</p>
                        <p className="text-[10px] text-gray-400 mt-1 leading-tight">Tingkat kelembapan moderat. Udara terasa segar.</p>
                    </div>
                }
              >
                <HumidityBars />
              </StatCard>
            </div>
          )}
        </div>

        {/* KOLOM KANAN (Visibility - Span 1 Column) */}
        <div className="lg:col-span-1 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 ml-1 pl-2 border-l-4 border-black/10">Detail Cuaca Lainnya</h3>
            <StatCard 
                className="min-h-[300px]"
                title="Visibility" 
                icon={<Eye size={18} fill="black" className="text-black"/>}
                footer={
                    <div>
                        <p className="font-bold text-gray-800 text-lg">Visibility: 8 km</p>
                        <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                            Jarak pandang baik untuk berkendara. Waspada terhadap sedikit haze (kabut tipis) atau partikel udara.
                        </p>
                    </div>
                }
            >
                <VisibilityPyramid />
            </StatCard>
        </div>
      </div>

      {/* --- MAP SECTION --- */}
      <section className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pl-2 border-l-4 border-black/10">Map</h3>
        <DashboardMap />
      </section>
    </main>
  );
}
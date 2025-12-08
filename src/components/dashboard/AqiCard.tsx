"use client";
import { useLocation } from "@/context/LocationContext";
import { useEffect, useState } from "react";

export default function AqiCard() {
  const { weather, loading } = useLocation();
  const [percent, setPercent] = useState(0);

  // Ambil Data
  const aqi = weather?.aqi || 0;
  
  // Logic Status & Warna (Biar teks Good berubah jadi Moderate dst)
  let status = "Good";
  let color = "#05CD99"; // Hijau asli
  
  if (aqi > 300) { status = "Hazardous"; color = "#7E0023"; }
  else if (aqi > 200) { status = "Very Unhealthy"; color = "#660099"; }
  else if (aqi > 150) { status = "Unhealthy"; color = "#EE5D50"; }
  else if (aqi > 100) { status = "Unhealthy (Sen)"; color = "#FF7B1C"; }
  else if (aqi > 50) { status = "Moderate"; color = "#FFB547"; }

  useEffect(() => {
    // Logic Posisi: 0 AQI = 0%, 300 AQI = 100%
    let p = (aqi / 300) * 100;
    if (p > 100) p = 100;
    if (p < 0) p = 0;
    setPercent(p);
  }, [aqi]);

  if (loading || !weather) return <div className="bg-white p-8 rounded-[30px] w-full h-full min-h-60 animate-pulse"></div>;

  return (
    <div className="bg-white p-8 rounded-[30px] shadow-[0_20px_25px_-5px_rgba(112,144,176,0.1)] w-full h-full min-h-60 flex flex-col justify-between border border-transparent">
       {/* Header */}
       <div className="flex items-center gap-2 mb-4">
         <img src="/images/Aqi_icon.svg" alt="Air Quality Index" />
         <span className="font-bold text-sm text-[#345B92]">Air Quality Index</span>
       </div>

       {/* Gradient Bar */}
       {/* Menggunakan class asli bg-linear-to-r dari kode temanmu */}
       <div className="relative w-full h-3 rounded-full bg-linear-to-r from-[#05CD99] via-[#FFB547] to-[#EE5D50] my-4">
         
         {/* INDICATOR: HAPUS 'left-[20%]', GANTI JADI STYLE */}
         <div 
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[3px] rounded-full shadow-lg z-10 cursor-pointer transition-all duration-1000 ease-out"
            style={{ 
                left: `${percent}%`,        // Posisi Dinamis
                borderColor: color          // Warna Border Dinamis
            }}
         ></div>
       </div>

       {/* Stats */}
       <div className="flex flex-col md:flex-row justify-between items-end mt-4">
         <div>
            <div className="flex items-baseline gap-2">
                {/* ANGKA DINAMIS */}
                <h2 className="text-6xl font-bold text-[#1B1B1E] leading-none">{aqi}</h2>
                {/* TEKS STATUS DINAMIS */}
                <span className="font-bold text-xl" style={{ color: color }}>{status}</span>
            </div>
         </div>
         <div className="max-w-md text-right mt-4 md:mt-0">
            <p className="text-[#1B1B1E] text-sm font-medium leading-relaxed">
               Air quality is {status.toLowerCase()}, based on real-time data.
            </p>
         </div>
       </div>
       <p className="text-[10px] text-[#A3AED0] mt-4">Data from WAQI</p>
    </div>
  );
}
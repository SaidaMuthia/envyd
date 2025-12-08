//

import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

interface WeatherMainProps {
  title: string;
  temp: number;
  condition: string;
  low: number;
  high: number;
  time?: string; // TAMBAHAN: Prop untuk waktu
}

export default function WeatherMain({ title, temp, condition, low, high, time }: WeatherMainProps) {
  
  const getWeatherIcon = (cond: string) => {
    const size = 100; 
    const c = cond.toLowerCase();

    if (c.includes("sun") || c.includes("clear")) {
      return <Sun size={size} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />;
    } else if (c.includes("partly") || c.includes("cloud") && c.includes("sun")) {
      return <CloudSun size={size} className="text-yellow-400 drop-shadow-md" />;
    } else if (c.includes("rain") || c.includes("drizzle")) {
      return <CloudRain size={size} className="text-blue-400 fill-blue-50 drop-shadow-md" />;
    } else if (c.includes("cloud")) {
      return <Cloud size={size} className="text-gray-400 fill-gray-100 drop-shadow-md" />;
    } else {
      return <Sun size={size} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />;
    }
  };

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-full min-h-52">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold border-b-2 border-[#1B2559] pb-1 text-[#1B2559]">{title}</h3>
        {/* TAMPILKAN WAKTU DARI API */}
        <span className="text-sm font-medium text-[#A3AED0]">
            {time || "12:00 PM"}
        </span>
      </div>

      {/* Icon Area */}
      <div className="flex flex-col items-center justify-center my-1 gap-1 flex-1">
         <div className="transform hover:scale-110 transition-transform duration-300">
            {getWeatherIcon(condition)}
         </div>
         <span className="text-[#A3AED0] font-medium text-sm mt-1">{condition}</span>
      </div>

      {/* Footer Info */}
      <div className="flex items-end justify-between mt-auto">
        <span className="text-6xl font-bold text-[#1B1B1E] tracking-tight">{temp}°</span>
        <div className="text-sm font-medium text-[#1B1B1E] text-right">
          <div>Low: {low}°</div>
          <div>High: {high}°</div>
        </div>
      </div>
    </div>
  );
}
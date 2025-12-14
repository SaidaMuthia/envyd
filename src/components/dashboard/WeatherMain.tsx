import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

interface WeatherMainProps {
  title: string;
  temp: number;
  condition: string;
  low: number;
  high: number;
  isCompact?: boolean; // <<-- PROP BARU
}

export default function WeatherMain({ title, temp, condition, low, high, isCompact }: WeatherMainProps) {
  
  // Pilih ukuran ikon berdasarkan mode: 100 untuk Default, 72 untuk Compact
  const size = isCompact ? 72 : 100; 

  const getWeatherIcon = (cond: string) => {
    const c = (cond || "").toLowerCase();
    if (c.includes("sun") || c.includes("clear")) return <Sun size={size} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />;
    else if (c.includes("partly") || c.includes("cloud") && c.includes("sun")) return <CloudSun size={size} className="text-yellow-400 drop-shadow-md" />;
    else if (c.includes("rain") || c.includes("drizzle")) return <CloudRain size={size} className="text-blue-400 fill-blue-50 drop-shadow-md" />;
    else if (c.includes("cloud")) return <Cloud size={size} className="text-gray-400 fill-gray-100 drop-shadow-md" />;
    else return <Sun size={size} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />;
  };

  // --- MODE COMPACT (SIDEBAR WIDE MAP) ---
  if (isCompact) {
    return (
      <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
        
        {/* Header Compact */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold border-b-2 border-[#1B2559] pb-1 text-[#1B2559]">{title}</h3> 
        </div>

        {/* KONTEN UTAMA COMPACT: Horizontal Layout */}
        <div className="flex items-center gap-4"> 
           
           {/* 1. Ikon Cuaca (size 72) */}
           <div className="transform hover:scale-110 transition-transform duration-300 shrink-0">
              {getWeatherIcon(condition)}
           </div>
           
           {/* 2. Suhu dan Kondisi */}
           <div className="flex flex-col justify-center flex-1">
               <span className="text-5xl font-bold text-[#1B1B1E] tracking-tight">{temp}°</span> 
               <span className="text-[#A3AED0] font-medium text-sm mt-0.5">{condition}</span>
           </div>
           
           {/* 3. Min/Max */}
           <div className="text-sm font-medium text-[#1B1B1E] text-right shrink-0">
              <div>Low: {low}°</div>
              <div>High: {high}°</div>
            </div>
        </div>
      </div>
    );
  }

  // --- MODE DEFAULT (DASHBOARD UTAMA) ---
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-full min-h-52">
      {/* Header Default */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold border-b-2 border-[#1B2559] pb-1 text-[#1B2559]">{title}</h3>
      </div>

      {/* Icon Area Default - Vertical Layout */}
      <div className="flex flex-col items-center justify-center my-1 gap-1 flex-1">
         <div className="transform hover:scale-110 transition-transform duration-300">
            {getWeatherIcon(condition)}
         </div>
         <span className="text-[#A3AED0] font-medium text-sm mt-1">{condition}</span>
      </div>

      {/* Footer Info Default */}
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
import { Sun, Cloud, CloudRain, CloudSun } from "lucide-react";

interface WeatherMainProps {
  title: string;
  temp: number | string; 
  condition: string;
  low: number | string;
  high: number | string;
}

export default function WeatherMain({ title, temp, condition, low, high }: WeatherMainProps) {
  
  // Helper Icon Sederhana (sesuai import lucide di atas)
  const getIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes("sun") || c.includes("clear")) return <Sun size={100} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />;
    else if (c.includes("partly") || c.includes("cloud") && c.includes("sun")) return <CloudSun size={100} className="text-yellow-400 drop-shadow-md" />;
    else if (c.includes("rain") || c.includes("drizzle")) return <CloudRain size={100} className="text-blue-400 fill-blue-50 drop-shadow-md" />;
    else return <Cloud size={100} className="text-gray-400 fill-gray-100 drop-shadow-md" />;
  };

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-full min-h-52">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold border-b-2 border-[#1B2559] pb-1 text-[#1B2559]">{title}</h3>
        <span className="text-sm font-medium text-[#A3AED0]">12:00 PM</span>
      </div>

      {/* Icon Area */}
      <div className="flex flex-col items-center justify-center my-1 gap-1 flex-1">
         <div className="transform hover:scale-110 transition-transform duration-300">
            {/* Panggil fungsi icon disini */}
            {getIcon(condition)}
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
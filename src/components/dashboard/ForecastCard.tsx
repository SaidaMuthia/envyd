import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

interface ForecastCardProps {
  day: string;
  condition: string;
  temp: number;
  rain?: boolean; // (Property ini sekarang tidak dipakai untuk render dots)
  onClick?: () => void;
}

export default function ForecastCard({ day, condition, temp, onClick }: ForecastCardProps) {
  
  const getIcon = () => {
    const size = 48; 
    switch (condition) {
      case 'Sunny': return <Sun size={size} className="text-yellow-400 fill-yellow-400" />;
      case 'Cloudy': return <Cloud size={size} className="text-gray-400 fill-gray-100" />;
      case 'Rainy': return <CloudRain size={size} className="text-blue-400 fill-blue-100" />;
      case 'Partly Cloudy': return <CloudSun size={size} className="text-yellow-400" />;
      default: return <Sun size={size} className="text-yellow-400" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col items-center justify-between py-6 px-4 rounded-[40px] cursor-pointer transition-all duration-300
        w-[130px] h-[280px] bg-[#E9EDF7] hover:bg-white hover:shadow-lg hover:-translate-y-1"
    >
      {/* Header */}
      <div className="w-full flex justify-center">
        <span className="text-2xl font-medium text-[#1B1B1E] border-b-2 border-[#1B1B1E] pb-1 px-1">
            {day}
        </span>
      </div>

      {/* Icon Area (TITIK 3 DIHAPUS) */}
      <div className="flex flex-col items-center gap-3">
        <div className="drop-shadow-sm">
            {getIcon()}
        </div>
        {/* Spacer agar tinggi tetap proporsional */}
        <div className="h-2"></div>
      </div>

      {/* Temperature */}
      <div className="text-5xl font-medium text-[#1B1B1E]">
        {temp}°
      </div>
    </div>
  );
}
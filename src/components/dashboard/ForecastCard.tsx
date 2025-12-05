import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

interface ForecastCardProps {
  day: string; // e.g., "Mon", "Tue"
  fullDayName?: string; // e.g., "Monday"
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Partly Cloudy';
  temp: number;
  rainChance?: number; // Percentage
  isActive?: boolean;
  onClick?: () => void;
}

export default function ForecastCard({ day, condition, temp, rainChance, isActive, onClick }: ForecastCardProps) {
  const getIcon = () => {
    switch (condition) {
      case 'Sunny': return <Sun size={32} className="text-yellow-400 fill-yellow-400" />;
      case 'Cloudy': return <Cloud size={32} className="text-gray-400 fill-gray-100" />;
      case 'Rainy': return <CloudRain size={32} className="text-blue-400 fill-blue-100" />;
      case 'Partly Cloudy': return <CloudSun size={32} className="text-yellow-400" />;
      default: return <Sun size={32} className="text-yellow-400" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        flex flex-col items-center justify-between p-4 rounded-[2.5rem] cursor-pointer transition-all duration-300
        min-w-[100px] h-[220px]
        ${isActive 
          ? 'bg-blue-50 border-2 border-blue-200 shadow-lg scale-105' 
          : 'bg-white hover:bg-gray-50 hover:shadow-md border border-transparent'}
      `}
    >
      {/* Day Header */}
      <div className={`text-lg font-bold ${isActive ? 'text-blue-600' : 'text-gray-600 border-b-2 border-gray-800 pb-1'}`}>
        {day}
      </div>

      {/* Icon Area */}
      <div className="flex flex-col items-center gap-1">
        {getIcon()}
        {rainChance && (
          <div className="flex items-center gap-0.5 mt-1">
             <div className="flex gap-0.5">
               <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
               <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
               <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
             </div>
          </div>
        )}
      </div>

      {/* Temperature */}
      <div className="text-3xl font-bold text-gray-800">
        {temp}°
      </div>
    </div>
  );
}
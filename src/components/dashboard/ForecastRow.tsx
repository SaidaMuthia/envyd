import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

interface ForecastRowProps {
  day: string;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Partly Cloudy';
  temp: number;
}

export default function ForecastRow({ day, condition, temp }: ForecastRowProps) {
  const getIcon = () => {
    switch (condition) {
      case 'Sunny': return <Sun className="text-yellow-500" />;
      case 'Cloudy': return <Cloud className="text-gray-400" />;
      case 'Rainy': return <CloudRain className="text-blue-500" />;
      case 'Partly Cloudy': return <CloudSun className="text-yellow-400" />;
      default: return <Sun className="text-yellow-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between bg-white py-3 px-4 rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
      <span className="font-bold text-[#2B3674] w-24">{day}</span>
      <div className="flex items-center gap-3 flex-1">
        {getIcon()}
        <span className="text-sm text-gray-500 font-medium">{condition}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-bold text-[#2B3674] text-lg">{temp}°</span>
        <div className="w-20 h-1.5 bg-gray-100 rounded-full ml-2 overflow-hidden">
            <div className="h-full bg-linear-to-r from-blue-400 to-yellow-400" style={{ width: `${(temp / 40) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}
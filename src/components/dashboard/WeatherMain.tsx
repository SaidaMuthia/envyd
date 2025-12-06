import { CloudSun } from "lucide-react";

interface WeatherMainProps {
  title: string; // "Today" atau "Tomorrow"
}

export default function WeatherMain({ title }: WeatherMainProps) {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-full min-h-60">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold border-b-2 border-[#1B2559] pb-1 text-[#1B2559]">{title}</h3>
        <span className="text-sm font-medium text-[#A3AED0]">12:00 PM</span>
      </div>

      <div className="flex justify-center my-4">
         <img src="/images/Weather_main_icon.svg" alt="Weather Icon" />
      </div>

      {/* Footer Info */}
      <div className="flex items-end justify-between mt-auto">
        <span className="text-6xl font-bold text-[#1B1B1E] tracking-tight">32°</span>
        <div className="text-sm font-medium text-[#1B1B1E] text-right">
          <div>Low: 28°</div>
          <div>High: 34°</div>
        </div>
      </div>
    </div>
  );
}
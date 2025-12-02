import { CloudSun } from "lucide-react";

export default function WeatherMain() {
  return (
    <div className="bg-white p-6 rounded-[30px] shadow-[0_20px_25px_-5px_rgba(112,144,176,0.1)] flex flex-col justify-between h-full min-h-[220px] relative overflow-hidden">
      {/* Background Decor (Opsional, efek glow halus) */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-50 rounded-full blur-3xl opacity-50"></div>

      <div className="flex justify-between items-start border-b border-[#F4F7FE] pb-3 mb-2 z-10">
        <h2 className="text-xl font-bold text-[#2B3674]">Today</h2>
        <span className="text-[#2B3674] text-xs font-bold bg-[#F4F7FE] px-3 py-1.5 rounded-full">12:00 PM</span>
      </div>

      <div className="flex flex-col items-center justify-center grow py-2 z-10">
         <CloudSun size={72} className="text-[#FFB547] drop-shadow-sm" />
      </div>

      <div className="flex items-end justify-between mt-2 z-10">
        <h1 className="text-5xl font-bold text-[#2B3674] tracking-tight">32°</h1>
        <div className="text-right text-[#A3AED0] text-xs font-bold space-y-1">
          <p>Low: 28°</p>
          <p>High: 34°</p>
        </div>
      </div>
    </div>
  );
}
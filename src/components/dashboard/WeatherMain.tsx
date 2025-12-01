import { CloudSun } from "lucide-react";

export default function WeatherMain() {
  return (
    <div className="bg-white p-6 rounded-4xl shadow-sm flex flex-col justify-between h-full min-h-[250px]">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold border-b-2 border-black inline-block pb-1">Today</h2>
        </div>
        <span className="text-gray-500 font-medium">12:00 PM</span>
      </div>

      <div className="flex flex-col items-center my-4">
        <CloudSun size={80} className="text-yellow-500 mb-2" />
      </div>

      <div className="flex items-end justify-between">
        <h1 className="text-6xl font-bold text-gray-800">32°</h1>
        <div className="text-right text-gray-500 text-sm">
          <p>Low: 28°</p>
          <p>High: 34°</p>
        </div>
      </div>
    </div>
  );
}
import { Wind } from "lucide-react";

export default function AqiCard() {
  return (
    <div className="bg-white p-6 rounded-4xl shadow-sm w-full mb-6">
      <div className="flex items-center gap-2 text-gray-500 mb-6">
        <Wind size={20} />
        <span className="font-medium">Air Quality Index</span>
      </div>

      {/* Gradient Bar */}
      <div className="relative w-full h-2 rounded-full bg-linear-to-r from-green-400 via-yellow-400 to-red-500 mb-8">
        {/* Slider Thumb Marker at Good position */}
        <div className="absolute top-1/2 -translate-y-1/2 left-[15%] w-4 h-4 bg-white border-4 border-green-500 rounded-full shadow-md"></div>
      </div>

      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-5xl font-bold text-gray-800">65</h2>
            <span className="text-green-600 font-semibold">Good</span>
        </div>
        <p className="text-gray-400 text-sm max-w-xs text-right">
            Air quality is satisfactory, and air pollution poses little or no risk.
        </p>
      </div>
    </div>
  );
}
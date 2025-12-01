import { Eye } from "lucide-react";

export default function VisibilityCard() {
  return (
    <div className="bg-white p-6 rounded-4xl shadow-sm h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Eye size={20} />
            <span className="font-medium">Visibility</span>
        </div>

        {/* Visual Bar Stack - Mocking the design */}
        <div className="flex flex-col items-center gap-2 my-2">
            <div className="w-1/2 h-2 bg-gray-200 rounded-full"></div>
            <div className="w-2/3 h-2 bg-green-400 rounded-full opacity-60"></div>
            <div className="w-3/4 h-2 bg-green-500 rounded-full opacity-80"></div>
            <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
            <div className="w-full h-2 bg-green-600 rounded-full"></div>
        </div>

        <div className="mt-4">
            <p className="text-xl font-bold text-gray-800">Visibility: 8 km</p>
            <p className="text-xs text-gray-400 mt-1">Jarak pandang baik untuk berkendara. Waspada terhadap sedikit haze.</p>
        </div>
    </div>
  );
}
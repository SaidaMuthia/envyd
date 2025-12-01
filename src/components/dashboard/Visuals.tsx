// Kompas Angin
export function WindCompass() {
  return (
    <div className="relative w-28 h-28 border-[3px] border-gray-100 rounded-full flex items-center justify-center bg-white">
        <span className="absolute top-2 text-[10px] text-gray-400 font-bold">N</span>
        <span className="absolute bottom-2 text-[10px] text-gray-400 font-bold">S</span>
        <span className="absolute left-2 text-[10px] text-gray-400 font-bold">W</span>
        <span className="absolute right-2 text-[10px] text-gray-400 font-bold">E</span>
        
        {/* Jarum Kompas */}
        <div className="relative w-full h-full flex items-center justify-center" style={{ transform: 'rotate(-45deg)' }}>
            <div className="w-1.5 h-12 bg-blue-100 rounded-full absolute"></div>
            <div className="w-1.5 h-6 bg-blue-500 rounded-full absolute top-2"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full z-10 border-2 border-white"></div>
        </div>
    </div>
  );
}

// Slider Feels Like
export function FeelsLikeSlider({ value }: { value: number }) {
  return (
    <div className="w-full px-4 py-4">
        <div className="relative w-full h-2 bg-gray-100 rounded-full">
            <div className="absolute left-0 top-0 h-full w-[60%] bg-blue-600 rounded-full"></div>
            <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-blue-600 rounded-full shadow cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
    </div>
  );
}

// Barcode Humidity
export function HumidityBars() {
  const bars = [40, 60, 30, 80, 50, 70, 40]; // Tinggi bar dalam %
  return (
    <div className="flex gap-2 items-end h-20 justify-center">
        {bars.map((h, i) => (
            <div 
                key={i} 
                style={{ height: `${h}%` }} 
                className={`w-3 rounded-full transition-all duration-500 ${i===3 ? 'bg-blue-600' : 'bg-blue-200'}`}
            ></div>
        ))}
    </div>
  );
}

// Piramida Visibility
export function VisibilityPyramid() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 grow py-4 w-full">
        <div className="w-[40%] h-2.5 bg-gray-100 rounded-full"></div>
        <div className="w-[55%] h-2.5 bg-green-300/50 rounded-full"></div>
        <div className="w-[70%] h-2.5 bg-green-400/70 rounded-full"></div>
        <div className="w-[85%] h-2.5 bg-green-500/90 rounded-full"></div>
        <div className="w-full h-2.5 bg-green-600 rounded-full shadow-sm"></div>
    </div>
  );
}
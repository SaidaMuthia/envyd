import React from 'react';

// Visualisasi Kompas Angin
export function WindCompass() {
  return (
    <div className="relative w-24 h-24 border-[3px] border-[#E9EDF7] rounded-full flex items-center justify-center bg-white mt-1">
        <span className="absolute top-1.5 text-[10px] text-gray-400 font-bold">N</span>
        <span className="absolute bottom-1.5 text-[10px] text-gray-400 font-bold">S</span>
        <span className="absolute left-1.5 text-[10px] text-gray-400 font-bold">W</span>
        <span className="absolute right-1.5 text-[10px] text-gray-400 font-bold">E</span>
        
        {/* Jarum Kompas (Rotated) */}
        <div className="relative w-full h-full flex items-center justify-center" style={{ transform: 'rotate(-45deg)' }}>
            <div className="w-1 h-20 bg-transparent absolute flex flex-col justify-between">
                 <div className="w-1.5 h-2 bg-[#E9EDF7] rounded-full"></div>
                 <div className="w-1.5 h-2 bg-[#E9EDF7] rounded-full"></div>
            </div>
            {/* Jarum Penunjuk */}
            <div className="w-1.5 h-9 bg-[#4318FF] rounded-full absolute top-4 shadow-sm"></div>
            <div className="w-3 h-3 bg-white border-[3px] border-[#4318FF] rounded-full z-10 shadow-sm"></div>
        </div>
    </div>
  );
}

// Visualisasi Slider Feels Like
export function FeelsLikeSlider({ value }: { value: number }) {
  return (
    <div className="w-full px-1 py-6">
        <div className="relative w-full h-2 bg-[#E9EDF7] rounded-full">
            {/* Progress Bar */}
            <div className="absolute left-0 top-0 h-full w-[60%] bg-[#4318FF] rounded-full"></div>
            {/* Slider Thumb */}
            <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-[#4318FF] rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
    </div>
  );
}

// Visualisasi Barcode Humidity
export function HumidityBars() {
  // Tinggi bar dalam persen untuk simulasi data
  const bars = [40, 60, 30, 80, 50, 70, 40]; 
  return (
    <div className="flex gap-1.5 items-end h-14 justify-center w-full">
        {bars.map((h, i) => (
            <div 
                key={i} 
                style={{ height: `${h}%` }} 
                className={`w-2.5 rounded-full transition-all duration-500 ${i===3 ? 'bg-[#4318FF]' : 'bg-[#E9EDF7]'}`}
            ></div>
        ))}
    </div>
  );
}

// Visualisasi Piramida Visibility
export function VisibilityPyramid() {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 grow py-2 w-full">
        <div className="w-[40%] h-2 bg-[#F4F7FE] rounded-full"></div>
        <div className="w-[55%] h-2 bg-[#05CD99]/40 rounded-full"></div>
        <div className="w-[70%] h-2 bg-[#05CD99]/60 rounded-full"></div>
        <div className="w-[85%] h-2 bg-[#05CD99]/80 rounded-full"></div>
        <div className="w-full h-2 bg-[#05CD99] rounded-full shadow-sm"></div>
    </div>
  );
}
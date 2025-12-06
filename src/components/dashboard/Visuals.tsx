//

import React from 'react';

// --- VISUALISASI EXISTING (TETAP) ---
export function WindCompass() {
  return (
    <div className="relative w-32 h-32 border-4 border-[#E9EDF7] rounded-full flex items-center justify-center bg-white mt-1">
        <span className="absolute top-2 text-xs text-gray-400 font-bold">N</span>
        <span className="absolute bottom-2 text-xs text-gray-400 font-bold">S</span>
        <span className="absolute left-2 text-xs text-gray-400 font-bold">W</span>
        <span className="absolute right-2 text-xs text-gray-400 font-bold">E</span>
        <div className="relative w-full h-full flex items-center justify-center" style={{ transform: 'rotate(-45deg)' }}>
            <div className="w-1.5 h-28 bg-transparent absolute flex flex-col justify-between">
                 <div className="w-1.5 h-2.5 bg-[#E9EDF7] rounded-full"></div>
                 <div className="w-1.5 h-2.5 bg-[#E9EDF7] rounded-full"></div>
            </div>
            <div className="w-2 h-14 bg-[#345B92] rounded-full absolute top-5 shadow-sm"></div>
            <div className="w-4 h-4 bg-white border-4 border-[#345B92] rounded-full z-10 shadow-sm"></div>
        </div>
    </div>
  );
}

export function FeelsLikeSlider({ value }: { value: number }) {
  return (
    <div className="w-full px-2 py-8">
        <div className="relative w-full h-4 bg-[#E9EDF7] rounded-full">
            <div className="absolute left-0 top-0 h-full w-[60%] bg-[#345B92] rounded-full"></div>
            <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-[#345B92] rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
    </div>
  );
}

export function HumidityBars() {
  const bars = [40, 60, 30, 80, 50, 70, 40]; 
  return (
    <div className="flex gap-2 items-end h-24 justify-center w-full">
        {bars.map((h, i) => (
            <div 
                key={i} 
                style={{ height: `${h}%` }} 
                className={`w-3.5 rounded-full transition-all duration-500 ${i===3 ? 'bg-[#345B92]' : 'bg-[#E9EDF7]'}`}
            ></div>
        ))}
    </div>
  );
}

// --- VISUALISASI BARU ---

// 1. Visibility Pyramid
export function VisibilityPyramid() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full py-4">
        <div className="w-[30%] h-3 bg-gray-200 rounded-full"></div>
        <div className="w-[45%] h-3 bg-[#4ADE80] opacity-40 rounded-full"></div>
        <div className="w-[60%] h-3 bg-[#4ADE80] opacity-70 rounded-full"></div>
        <div className="w-[75%] h-3 bg-[#22C55E] opacity-90 rounded-full"></div>
        <div className="w-[90%] h-3 bg-[#16A34A] rounded-full shadow-sm"></div>
    </div>
  );
}

// 2. UV Gauge (DIPERBAIKI)
export function UvGauge() {
    return (
      <div className="relative w-40 h-32 flex items-center justify-center mt-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 120 100">
          <defs>
            {/* Gradient 4 warna: Kuning -> Orange -> Merah -> Ungu */}
            <linearGradient id="uvGradient" x1="0%" y1="100%" x2="100%" y2="100%" gradientTransform="rotate(0)">
              <stop offset="0%" stopColor="#FACC15" />   {/* Kuning */}
              <stop offset="40%" stopColor="#FB923C" />  {/* Orange */}
              <stop offset="70%" stopColor="#EF4444" />  {/* Merah */}
              <stop offset="100%" stopColor="#7C3AED" /> {/* Ungu */}
            </linearGradient>
          </defs>
          
          {/* Track Latar (Abu-abu Pudar) */}
          {/* Path setengah lingkaran (arc) */}
          <path
            d="M 20 85 A 45 45 0 1 1 100 85" 
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Track Warna-warni (Gradient) */}
          <path
            d="M 20 85 A 45 45 0 1 1 100 85"
            fill="none"
            stroke="url(#uvGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Dot Indicator Merah (Posisi di area merah/tinggi) */}
          <circle cx="88" cy="35" r="7" fill="#EF4444" stroke="white" strokeWidth="3" className="shadow-md" />
        </svg>
        
        {/* Angka di Tengah */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span className="text-6xl font-medium text-[#1B1B1E] leading-none tracking-tighter">9</span>
        </div>
      </div>
    );
}

// 3. Rain Chart
export function RainChart() {
    const points = [40, 25, 75, 20, 65, 30]; 
    const xPos = [8.33, 25, 41.66, 58.33, 75, 91.66];

    const pathD = `
      M ${xPos[0]} ${100 - points[0]} 
      C ${xPos[0] + 10} ${100 - points[0]}, ${xPos[1] - 10} ${100 - points[1]}, ${xPos[1]} ${100 - points[1]}
      S ${xPos[2] - 10} ${100 - points[2]}, ${xPos[2]} ${100 - points[2]}
      S ${xPos[3] - 10} ${100 - points[3]}, ${xPos[3]} ${100 - points[3]}
      S ${xPos[4] - 10} ${100 - points[4]}, ${xPos[4]} ${100 - points[4]}
      S ${xPos[5] - 10} ${100 - points[5]}, ${xPos[5]} ${100 - points[5]}
    `;

    return (
        <div className="w-full h-40 relative px-2 pt-8 pb-4">
            <div className="absolute inset-x-4 top-[30%] border-t border-dotted border-gray-400"></div>
            <div className="absolute inset-x-4 top-[60%] border-t border-dotted border-gray-400"></div>
            <div className="absolute inset-x-4 top-[15%] border-t border-dotted border-gray-400 opacity-50"></div>

            <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none px-2 pt-8 pb-4 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path 
                    d={pathD}
                    fill="none" 
                    stroke="#60A5FA" 
                    strokeWidth="2"
                    className="drop-shadow-sm"
                />
            </svg>

            <div className="relative w-full h-full">
                {points.map((h, i) => (
                    <div 
                        key={i} 
                        className="absolute bottom-0 w-2 bg-[#BFDBFE]/50 rounded-t-full z-10 flex flex-col items-center group hover:bg-[#BFDBFE] transition-colors"
                        style={{ 
                            left: `calc(${xPos[i]}% - 4px)`, 
                            height: `${h}%` 
                        }}
                    >
                        <div className="absolute -top-1.5 w-1.5 h-3 bg-[#1B1B1E] rounded-full z-30"></div>
                        <div 
                            className="absolute bg-white border-[3px] border-[#60A5FA] rounded-full z-40 w-3 h-3"
                            style={{ top: '-14px' }} 
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
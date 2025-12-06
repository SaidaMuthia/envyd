//

import React from 'react';

// --- VISUALISASI EXISTING (UKURAN DIPERBESAR & WARNA #345B92) ---

export function WindCompass() {
  // Mengubah w-24 h-24 (96px) menjadi w-32 h-32 (128px) agar seimbang dengan icon cuaca
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
            {/* Jarum diperbesar & ditebalkan */}
            <div className="w-2 h-14 bg-[#345B92] rounded-full absolute top-5 shadow-sm"></div>
            {/* Titik tengah diperbesar */}
            <div className="w-4 h-4 bg-white border-4 border-[#345B92] rounded-full z-10 shadow-sm"></div>
        </div>
    </div>
  );
}

export function FeelsLikeSlider({ value }: { value: number }) {
  return (
    <div className="w-full px-2 py-8"> {/* Padding vertikal ditambah agar tidak terlalu gepeng */}
        {/* Track dipertebal dari h-2 menjadi h-4 */}
        <div className="relative w-full h-4 bg-[#E9EDF7] rounded-full">
            <div className="absolute left-0 top-0 h-full w-[60%] bg-[#345B92] rounded-full"></div>
            {/* Knob diperbesar menjadi w-7 h-7 */}
            <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-[#345B92] rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
    </div>
  );
}

export function HumidityBars() {
  const bars = [40, 60, 30, 80, 50, 70, 40]; 
  return (
    // Tinggi diperbesar dari h-14 (56px) menjadi h-24 (96px) mendekati ukuran icon utama
    <div className="flex gap-2 items-end h-24 justify-center w-full">
        {bars.map((h, i) => (
            <div 
                key={i} 
                style={{ height: `${h}%` }} 
                // Batang diperlebar menjadi w-3.5
                className={`w-3.5 rounded-full transition-all duration-500 ${i===3 ? 'bg-[#345B92]' : 'bg-[#E9EDF7]'}`}
            ></div>
        ))}
    </div>
  );
}

// --- VISUALISASI BARU (Tetap sama, hanya diexport ulang) ---

// 1. Visibility Pyramid
export function VisibilityPyramid() {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 w-full py-2">
        <div className="w-[35%] h-2.5 bg-[#E9EDF7] rounded-full"></div>
        <div className="w-[50%] h-2.5 bg-[#6FEFAD] rounded-full"></div>
        <div className="w-[65%] h-2.5 bg-[#45D088] rounded-full"></div>
        <div className="w-[80%] h-2.5 bg-[#29AB68] rounded-full"></div>
        <div className="w-full h-2.5 bg-[#1B834B] rounded-full shadow-sm"></div>
    </div>
  );
}

// 2. UV Gauge
export function UvGauge() {
    return (
      <div className="relative w-40 h-40 flex items-center justify-center -my-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="uvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFCE47" /> 
              <stop offset="50%" stopColor="#FF5B5B" /> 
              <stop offset="100%" stopColor="#6B3AC1" /> 
            </linearGradient>
          </defs>
          <path
            d="M 20 80 A 42 42 0 1 1 80 80"
            fill="none"
            stroke="url(#uvGradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="78" cy="38" r="5" fill="#FF5B5B" stroke="white" strokeWidth="2" className="shadow-md" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
            <span className="text-6xl font-bold text-[#1B1B1E] leading-none">9</span>
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
      C ${xPos[0] + 5} ${100 - points[0]}, ${xPos[1] - 5} ${100 - points[1]}, ${xPos[1]} ${100 - points[1]}
      S ${xPos[2] - 5} ${100 - points[2]}, ${xPos[2]} ${100 - points[2]}
      S ${xPos[3] - 5} ${100 - points[3]}, ${xPos[3]} ${100 - points[3]}
      S ${xPos[4] - 5} ${100 - points[4]}, ${xPos[4]} ${100 - points[4]}
      S ${xPos[5] - 5} ${100 - points[5]}, ${xPos[5]} ${100 - points[5]}
    `;

    return (
        <div className="w-full h-40 relative px-2 pt-6 pb-2">
            <div className="absolute inset-x-2 top-[30%] border-t-2 border-dotted border-gray-300"></div>
            <div className="absolute inset-x-2 top-[60%] border-t-2 border-dotted border-gray-300"></div>

            <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none px-2 pt-6 pb-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path 
                    d={pathD}
                    fill="none" 
                    stroke="#93C5FD" 
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke" 
                />
            </svg>

            <div className="relative w-full h-full">
                {points.map((h, i) => (
                    <div 
                        key={i} 
                        className="absolute bottom-0 w-1.5 bg-[#BFDBFE] rounded-t-full z-10 flex flex-col items-center"
                        style={{ 
                            left: `calc(${xPos[i]}% - 3px)`, 
                            height: `${h}%` 
                        }}
                    >
                        <div className="absolute -top-1 w-1.5 h-3 bg-[#1B1B1E] rounded-full z-20"></div>
                        <div 
                            className="absolute bg-white border-2 border-[#60A5FA] rounded-full z-30 w-2.5 h-2.5"
                            style={{ top: '-10px' }} 
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
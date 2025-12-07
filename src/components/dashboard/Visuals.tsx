//

import React from 'react';

// ... (WindCompass, FeelsLikeSlider, HumidityBars, VisibilityPyramid TETAP SAMA seperti sebelumnya)
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

export function VisibilityPyramid() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full py-4 scale-110">
        <div className="w-[30%] h-3 bg-gray-200 rounded-full"></div>
        <div className="w-[45%] h-3 bg-[#4ADE80] rounded-full"></div>
        <div className="w-[60%] h-3 bg-[#22C55E] rounded-full"></div>
        <div className="w-[75%] h-3 bg-[#16A34A] rounded-full"></div>
        <div className="w-[90%] h-3 bg-[#15803D] rounded-full shadow-sm"></div>
    </div>
  );
}

// 2. UV Gauge (DIPERBAIKI AGAR TIDAK KELUAR KOTAK)
export function UvGauge() {
    return (
      // w-32 h-32 sudah cukup compact
      <div className="relative w-32 h-32 flex items-center justify-center mt-2">
        {/* ViewBox diperlebar (-10) agar stroke tebal tidak terpotong */}
        <svg className="w-full h-full overflow-visible" viewBox="-10 -10 140 120">
          <defs>
            <linearGradient id="uvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FACC15" />   
              <stop offset="35%" stopColor="#FB923C" />  
              <stop offset="65%" stopColor="#EF4444" />  
              <stop offset="100%" stopColor="#7C3AED" /> 
            </linearGradient>
          </defs>
          
          {/* Path Latar */}
          <path
            d="M 20 90 A 45 45 0 1 1 100 90" 
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Path Gradient */}
          <path
            d="M 20 90 A 45 45 0 1 1 100 90"
            fill="none"
            stroke="url(#uvGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Dot Indicator */}
          <circle cx="92" cy="40" r="7" fill="#EF4444" stroke="white" strokeWidth="3" className="shadow-md" />
        </svg>
        
        {/* Angka di Tengah */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
            <span className="text-6xl font-medium text-[#1B1B1E] leading-none tracking-tighter">9</span>
        </div>
      </div>
    );
}

// 3. Rain Chart (DIPERBAIKI)
export function RainChart() {
    const data = [
        { time: '10AM', value: 40 },
        { time: '11AM', value: 30 },
        { time: '12AM', value: 85 }, 
        { time: '01PM', value: 45 },
        { time: '02PM', value: 55 },
        { time: '03PM', value: 25 }
    ];

    const getX = (index: number) => (index * (100 / (data.length - 1)));
    
    const points = data.map((d, i) => ({
        x: getX(i),
        y: 100 - d.value, 
        h: d.value,
        label: d.time
    }));

    const dPath = `
      M ${points[0].x} ${points[0].y} 
      C ${points[0].x + 8} ${points[0].y}, ${points[1].x - 8} ${points[1].y}, ${points[1].x} ${points[1].y}
      S ${points[2].x - 8} ${points[2].y}, ${points[2].x} ${points[2].y}
      S ${points[3].x - 8} ${points[3].y}, ${points[3].x} ${points[3].y}
      S ${points[4].x - 8} ${points[4].y}, ${points[4].x} ${points[4].y}
      S ${points[5].x - 8} ${points[5].y}, ${points[5].x} ${points[5].y}
    `;

    return (
        <div className="w-full h-full relative px-2 pt-4 pb-0 flex flex-col justify-between">
            {/* Area Grafik */}
            <div className="relative w-full flex-1">
                {/* Latar Garis */}
                <div className="absolute inset-x-0 top-[30%] border-t-[1.5px] border-dotted border-gray-400/50"></div>
                <div className="absolute inset-x-0 top-[60%] border-t-[1.5px] border-dotted border-gray-400/50"></div>
                
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {points.map((p, i) => (
                        <line 
                            key={`bar-${i}`}
                            x1={p.x} y1={p.y} 
                            x2={p.x} y2="100" 
                            stroke="#BFDBFE" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            className="opacity-80"
                        />
                    ))}

                    <path 
                        d={dPath} 
                        fill="none" 
                        stroke="#60A5FA" 
                        strokeWidth="2" 
                        className="drop-shadow-sm"
                    />

                    {points.map((p, i) => (
                        <g key={`dot-${i}`}>
                            {[2, 4].includes(i) && (
                                <rect x={p.x - 1.5} y={p.y - 6} width="3" height="6" rx="1.5" fill="#1B1B1E" />
                            )}
                            <circle cx={p.x} cy={p.y} r="2.5" fill="white" stroke="#3B82F6" strokeWidth="1.5" />
                        </g>
                    ))}
                </svg>
            </div>

            {/* Area Label Waktu (Pas di bawah titik) */}
            <div className="flex justify-between w-full mt-1">
                {points.map((p, i) => (
                    <div key={i} className="text-[9px] text-[#A3AED0] font-bold uppercase tracking-wider text-center" style={{ width: '16%' }}>
                        {p.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
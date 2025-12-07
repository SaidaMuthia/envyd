//

import React from 'react';

// ... (WindCompass, FeelsLikeSlider, HumidityBars, VisibilityPyramid TETAP SAMA)
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

// 2. UV Gauge (DIPERBAIKI: Angka Dinamis)
export function UvGauge({ uvValue = 0 }: { uvValue?: number }) {
    // Normalisasi UV value ke persentase (0-100%)
    // UV Index max realistic ~12, kita set 15 sebagai 100%
    const percentage = Math.min((uvValue / 15) * 100, 100);
    const rotationDegree = (percentage / 100) * 180; // 0-180 derajat untuk semicircle
    
    return (
      <div className="relative w-32 h-32 flex items-center justify-center mt-2">
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
            // Teknik strokeDasharray untuk memotong path sesuai persentase
            // Panjang arc radius 45 ~= 141px (setengah keliling lingkaran radius 45)
            // Tapi kita pakai teknik rotasi mask atau dasharray sederhana
            pathLength={100}
            strokeDasharray={`${percentage} 100`} 
          />

          {/* Dot Indicator - bergerak sesuai UV value */}
          {/* Kita rotasi group ini dari titik pusat (60, 90) */}
          <g style={{ 
              transform: `rotate(${rotationDegree}deg)`, 
              transformOrigin: '60px 90px', 
              transition: 'transform 1s ease-out'
            }}>
             {/* Dot ditempatkan di posisi awal (kiri bawah/0 derajat) lalu dirotasi */}
             <circle cx="20" cy="90" r="7" fill="#EF4444" stroke="white" strokeWidth="3" className="shadow-md" />
          </g>
        </svg>
        
        {/* Angka di Tengah - SEKARANG DINAMIS */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
            <span className="text-6xl font-medium text-[#1B1B1E] leading-none tracking-tighter">
              {Math.round(uvValue)}
            </span>
        </div>
      </div>
    );
}

// ... (RainChart TETAP SAMA)
export function RainChart({ hourlyData = [] }: { hourlyData?: Array<{ time: string; rainfall: number }> }) {
    let data = hourlyData.slice(0, 6);
    
    if (data.length === 0) {
      data = [
        { time: '10AM', rainfall: 2 },
        { time: '11AM', rainfall: 1.5 },
        { time: '12PM', rainfall: 4 }, 
        { time: '1PM', rainfall: 2.5 },
        { time: '2PM', rainfall: 3 },
        { time: '3PM', rainfall: 1 }
      ];
    }

    const getX = (index: number) => (index * (100 / (Math.max(data.length - 1, 1))));
    
    const maxValue = Math.max(...data.map(d => d.rainfall || 0), 5);
    const points = data.map((d, i) => ({
        x: getX(i),
        y: 100 - ((d.rainfall || 0) / maxValue * 80), 
        value: d.rainfall || 0,
        label: typeof d.time === 'string' ? d.time.split(':')[0] + 'H' : d.time
    }));

    const dPath = points.length > 0 ? `
      M ${points[0].x} ${points[0].y} 
      ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}
    ` : 'M 0 0';

    return (
        <div className="w-full h-full relative px-2 pt-4 pb-0 flex flex-col justify-between">
            <div className="relative w-full flex-1">
                <div className="absolute inset-x-0 top-[30%] border-t-[1.5px] border-dotted border-gray-400/50"></div>
                <div className="absolute inset-x-0 top-[60%] border-t-[1.5px] border-dotted border-gray-400/50"></div>
                
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {points.map((p, i) => (
                        <g key={`bar-${i}`}>
                            <line 
                                x1={p.x} y1={p.y} 
                                x2={p.x} y2="100" 
                                stroke="#BFDBFE" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                opacity="0.8"
                            />
                            <text 
                                x={p.x} y={p.y - 5}
                                textAnchor="middle"
                                fontSize="8"
                                fill="#1B1B1E"
                                fontWeight="bold"
                            >
                                {p.value.toFixed(1)}
                            </text>
                        </g>
                    ))}

                    <path 
                        d={dPath} 
                        fill="none" 
                        stroke="#60A5FA" 
                        strokeWidth="2" 
                        style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'}}
                    />

                    {points.map((p, i) => (
                        <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="2.5" fill="white" stroke="#3B82F6" strokeWidth="1.5" />
                    ))}
                </svg>
            </div>

            <div className="flex justify-between w-full mt-1">
                {points.map((p, i) => (
                    <div key={i} className="text-[9px] text-[#A3AED0] font-bold uppercase tracking-wider text-center" style={{ width: `${100/points.length}%` }}>
                        {p.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
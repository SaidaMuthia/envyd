//

import React from 'react';

// ... (WindCompass, FeelsLikeSlider, HumidityBars, VisibilityPyramid, UvGauge TETAP SAMA) ...
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

export function UvGauge({ uvValue = 0 }: { uvValue?: number }) {
    const percentage = Math.min((uvValue / 15) * 100, 100);
    const startAngle = -120;
    const endAngle = 120;
    const currentAngle = startAngle + (percentage / 100) * (endAngle - startAngle);

    const radius = 45;
    const cx = 60; 
    const cy = 60; 
    const radians = (currentAngle - 90) * (Math.PI / 180);
    const dotX = cx + radius * Math.cos(radians);
    const dotY = cy + radius * Math.sin(radians);

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
          <path d="M 21 82.5 A 45 45 0 1 1 99 82.5" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
          <path d="M 21 82.5 A 45 45 0 1 1 99 82.5" fill="none" stroke="url(#uvGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${percentage * 1.85}, 300`} />
          <circle cx={dotX} cy={dotY} r="7" fill="#EF4444" stroke="white" strokeWidth="3" className="shadow-md transition-all duration-700 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className="text-6xl font-medium text-[#1B1B1E] leading-none tracking-tighter">
                {Math.round(uvValue)}
            </span>
        </div>
      </div>
    );
}

// --- PERBAIKAN: RAIN CHART (ASPECT RATIO FIX) ---
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

    const maxValue = Math.max(...data.map(d => d.rainfall || 0), 5);
    
    // VIEWBOX BARU: 300x120 (Lebih lebar)
    // Ini membuat koordinat X lebih panjang, sehingga lingkaran tidak gepeng
    const CANVAS_WIDTH = 300;
    const CANVAS_HEIGHT = 120;
    
    const getX = (index: number) => {
        // Padding kiri kanan 10px
        const usableWidth = CANVAS_WIDTH - 20;
        return 10 + (index * (usableWidth / (Math.max(data.length - 1, 1))));
    };
    
    const points = data.map((d, i) => ({
        x: getX(i),
        // Y scale menyesuaikan tinggi kanvas (max 100 agar ada space bawah untuk label)
        y: 100 - ((d.rainfall || 0) / maxValue * 80), 
        value: d.rainfall || 0,
        label: typeof d.time === 'string' ? d.time.split(':')[0] : d.time
    }));

    const dPath = points.length > 0 ? `
      M ${points[0].x} ${points[0].y} 
      ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}
    ` : 'M 0 0';

    return (
        <div className="w-full h-full relative px-0 pt-2 pb-0 flex flex-col justify-end">
            <div className="relative w-full h-full flex items-end justify-center">
                {/* SVG tanpa 'preserveAspectRatio="none"' agar tidak gepeng */}
                <svg 
                    className="w-full h-auto max-h-full overflow-visible" 
                    viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} 
                    // HAPUS preserveAspectRatio="none" -> Default "xMidYMid meet"
                >
                    {/* Garis Latar */}
                    <line x1="0" y1="30" x2={CANVAS_WIDTH} y2="30" stroke="#9CA3AF" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                    <line x1="0" y1="70" x2={CANVAS_WIDTH} y2="70" stroke="#9CA3AF" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />

                    {points.map((p, i) => (
                        <g key={`bar-${i}`}>
                            <line 
                                x1={p.x} y1={p.y} 
                                x2={p.x} y2="100" 
                                stroke="#BFDBFE" 
                                strokeWidth="12" 
                                strokeLinecap="round" 
                                opacity="0.6"
                            />
                            
                            <circle cx={p.x} cy="105" r="3" fill="#A3AED0" />

                            {/* Label Waktu */}
                            <text 
                                x={p.x} y="120" 
                                textAnchor="middle" 
                                className="fill-[#A3AED0] font-bold uppercase tracking-wider"
                                style={{ fontSize: '18px' }} // Font disesuaikan dengan skala viewBox
                            >
                                {p.label}
                            </text>
                        </g>
                    ))}

                    <path 
                        d={dPath} 
                        fill="none" 
                        stroke="#60A5FA" 
                        strokeWidth="4" 
                        style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}
                    />

                    {points.map((p, i) => (
                        <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="6" fill="white" stroke="#3B82F6" strokeWidth="3" />
                    ))}
                </svg>
            </div>
        </div>
    );
}
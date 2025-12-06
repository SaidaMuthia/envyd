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
    <div className="flex flex-col items-center justify-center gap-2 w-full py-4">
        <div className="w-[30%] h-3 bg-gray-200 rounded-full"></div>
        <div className="w-[45%] h-3 bg-[#4ADE80] opacity-40 rounded-full"></div>
        <div className="w-[60%] h-3 bg-[#4ADE80] opacity-70 rounded-full"></div>
        <div className="w-[75%] h-3 bg-[#22C55E] opacity-90 rounded-full"></div>
        <div className="w-[90%] h-3 bg-[#16A34A] rounded-full shadow-sm"></div>
    </div>
  );
}

export function UvGauge() {
    return (
      // PERBAIKAN: Hapus 'mt-4' agar tidak ada jarak ekstra di atas
      <div className="relative w-40 h-32 flex items-center justify-center mt-0">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 120 100">
          <defs>
            <linearGradient id="uvGradient" x1="0%" y1="100%" x2="100%" y2="100%" gradientTransform="rotate(0)">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="40%" stopColor="#FB923C" />
              <stop offset="70%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <path d="M 20 85 A 45 45 0 1 1 100 85" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
          <path d="M 20 85 A 45 45 0 1 1 100 85" fill="none" stroke="url(#uvGradient)" strokeWidth="8" strokeLinecap="round" />
          <circle cx="88" cy="35" r="7" fill="#EF4444" stroke="white" strokeWidth="3" className="shadow-md" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span className="text-6xl font-medium text-[#1B1B1E] leading-none tracking-tighter">9</span>
        </div>
      </div>
    );
}

// --- PERBAIKAN DI SINI (RainChart) ---
export function RainChart() {
    const dataPoints = [40, 25, 75, 20, 65, 30]; 
    const timeLabels = ["10AM", "11AM", "12AM", "01PM", "02PM", "03PM"];

    const points = dataPoints.map((val, i) => {
        const x = (i / (dataPoints.length - 1)) * 100;
        const y = 100 - val; 
        return { x, y, val, label: timeLabels[i] };
    });

    const buildPath = () => {
        if (points.length === 0) return "";
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) / 2;
            const cp2x = p0.x + (p1.x - p0.x) / 2;
            d += ` C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`;
        }
        return d;
    };

    return (
        <div className="w-full h-48 relative px-5 pt-8 pb-6 select-none">
            {/* Grid Lines */}
            <div className="absolute inset-x-5 top-[30%] border-t border-dotted border-gray-400/50"></div>
            <div className="absolute inset-x-5 top-[60%] border-t border-dotted border-gray-400/50"></div>
            <div className="absolute inset-x-5 top-[15%] border-t border-dotted border-gray-400/30"></div>

            {/* Area Grafik */}
            <div className="absolute inset-x-5 top-8 bottom-8">
                <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path 
                        d={buildPath()}
                        fill="none" 
                        stroke="#60A5FA" 
                        strokeWidth="3"
                        className="drop-shadow-sm"
                        vectorEffect="non-scaling-stroke" 
                    />
                </svg>

                {points.map((p, i) => (
                    <div 
                        key={i} 
                        className="absolute bottom-0 w-2 bg-[#BFDBFE]/50 rounded-t-full z-10 flex flex-col items-center group hover:bg-[#BFDBFE] transition-colors"
                        style={{ 
                            left: `calc(${p.x}% - 4px)`, 
                            height: `${p.val}%` 
                        }}
                    >
                        <div className="absolute -top-1.5 w-1.5 h-3 bg-[#1B1B1E] rounded-full z-30"></div>
                        <div 
                            className="absolute bg-white border-[3px] border-[#60A5FA] rounded-full z-40 w-3.5 h-3.5 shadow-sm transform transition-transform group-hover:scale-125"
                            style={{ top: '-14px' }}
                        ></div>
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1B1B1E] text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-50">
                           {p.val}%
                        </div>
                    </div>
                ))}
            </div>

            {/* LABEL WAKTU DIPERKECIL DI SINI */}
            <div className="absolute inset-x-5 bottom-0 h-6">
                 {points.map((p, i) => (
                    <div 
                        key={i}
                        // GANTI: text-[10px] -> text-[8px]
                        // HAPUS: tracking-wider (agar lebih rapat)
                        className="absolute bottom-1 text-[8px] font-bold text-[#A3AED0] uppercase transform -translate-x-1/2"
                        style={{ left: `${p.x}%` }}
                    >
                        {p.label}
                    </div>
                 ))}
            </div>
        </div>
    );
}
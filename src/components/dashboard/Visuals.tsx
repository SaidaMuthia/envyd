"use client";

// 1. WIND COMPASS
export function WindCompass({ direction = 0 }: { direction?: number | string }) {
  // Logic konversi string ke derajat
  let rotation = 0;
  if (typeof direction === 'number') {
      rotation = direction;
  } else {
      const map: Record<string, number> = { N:0, NE:45, E:90, SE:135, S:180, SW:225, W:270, NW:315 };
      rotation = map[direction] || 0;
  }

  return (
    <div className="relative w-32 h-32 border-4 border-[#E9EDF7] rounded-full flex items-center justify-center bg-white mt-1 shadow-inner">
        <span className="absolute top-2 text-xs text-gray-400 font-bold">N</span>
        <span className="absolute bottom-2 text-xs text-gray-400 font-bold">S</span>
        <span className="absolute left-2 text-xs text-gray-400 font-bold">W</span>
        <span className="absolute right-2 text-xs text-gray-400 font-bold">E</span>
        
        {/* TAMBAH STYLE ROTATE */}
        <div 
            className="relative w-full h-full flex items-center justify-center transition-transform duration-1000 ease-out" 
            style={{ transform: `rotate(${rotation}deg)` }} 
        >
            <div className="w-1.5 h-28 bg-transparent absolute flex flex-col justify-between opacity-20">
                 <div className="w-1.5 h-2.5 bg-[#E9EDF7] rounded-full"></div>
                 <div className="w-1.5 h-2.5 bg-[#E9EDF7] rounded-full"></div>
            </div>
            <div className="w-2 h-14 bg-[#345B92] rounded-full absolute top-5 shadow-sm"></div>
            <div className="w-4 h-4 bg-white border-4 border-[#345B92] rounded-full z-10 shadow-sm"></div>
        </div>
    </div>
  );
}

// 2. FEELS LIKE SLIDER
export function FeelsLikeSlider({ value = 30 }: { value?: number }) {
  let percent = (value / 50) * 100; 
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  return (
    <div className="w-full px-2 py-8">
        <div className="relative w-full h-4 bg-[#E9EDF7] rounded-full overflow-hidden">
            {/* TAMBAH STYLE WIDTH */}
            <div 
                className="absolute left-0 top-0 h-full bg-[#345B92] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percent}%` }}
            ></div>
        </div>
        {/* TAMBAH STYLE LEFT */}
        <div 
            className="absolute -top-5 w-7 h-7 bg-white border-4 border-[#345B92] rounded-full shadow-lg cursor-pointer transition-all duration-1000 ease-out"
            style={{ left: `calc(${percent}% - 14px)` }}
        ></div>
    </div>
  );
}

// 3. HUMIDITY BARS
export function HumidityBars({ current = 40 }: { current?: number }) {
  const bars = [current - 15, current - 5, current + 5, current, current - 10, current + 2, current - 20];
  
  return (
    <div className="flex gap-2 items-end h-24 justify-center w-full">
        {bars.map((h, i) => {
            let height = h;
            if (height > 100) height = 100;
            if (height < 10) height = 10;

            return (
                <div 
                    key={i} 
                    style={{ height: `${height}%` }} 
                    className={`w-3.5 rounded-full transition-all duration-700 ease-in-out ${i===3 ? 'bg-[#345B92]' : 'bg-[#E9EDF7]'}`}
                ></div>
            );
        })}
    </div>
  );
}

// 4. VISIBILITY PYRAMID
export function VisibilityPyramid({ value = 10 }: { value?: number }) {
  const activeLevel = Math.ceil(value / 2); 
  const getOpacity = (barLevel: number) => activeLevel >= (6 - barLevel) ? "opacity-100" : "opacity-30";

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full py-4">
        <div className={`w-[30%] h-3 bg-[#4ADE80] rounded-full transition-all duration-500 ${getOpacity(5)}`}></div>
        <div className={`w-[45%] h-3 bg-[#4ADE80] rounded-full transition-all duration-500 ${getOpacity(4)}`}></div>
        <div className={`w-[60%] h-3 bg-[#4ADE80] rounded-full transition-all duration-500 ${getOpacity(3)}`}></div>
        <div className={`w-[75%] h-3 bg-[#22C55E] rounded-full transition-all duration-500 ${getOpacity(2)}`}></div>
        <div className={`w-[90%] h-3 bg-[#16A34A] rounded-full shadow-sm transition-all duration-500 ${getOpacity(1)}`}></div>
    </div>
  );
}

// 5. UV GAUGE
export function UvGauge({ value = 0 }: { value?: number }) {
    let rotation = -90 + (value / 12) * 180;
    if (rotation > 90) rotation = 90;
    if (rotation < -90) rotation = -90;

    return (
      <div className="relative w-40 h-32 flex items-center justify-center mt-0 overflow-hidden">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 120 100">
          <defs>
            <linearGradient id="uvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <path d="M 20 85 A 45 45 0 1 1 100 85" fill="none" stroke="#E5E7EB" strokeWidth="12" strokeLinecap="round" />
          <path d="M 20 85 A 45 45 0 1 1 100 85" fill="none" stroke="url(#uvGradient)" strokeWidth="12" strokeLinecap="round" />
          
          {/* JARUM BERPUTAR */}
          <g transform={`rotate(${rotation}, 60, 85)`} className="transition-transform duration-1000 ease-out">
             <line x1="60" y1="85" x2="60" y2="35" stroke="#1B1B1E" strokeWidth="4" strokeLinecap="round" />
             <circle cx="60" cy="35" r="5" fill="#EF4444" stroke="white" strokeWidth="2" />
          </g>
          <circle cx="60" cy="85" r="4" fill="#1B1B1E" />
        </svg>
        <div className="absolute bottom-0 flex flex-col items-center justify-end pb-2">
            {/* ANGKA DINAMIS */}
            <span className="text-4xl font-bold text-[#1B1B1E] leading-none">{value}</span>
            <span className="text-[10px] text-gray-400 font-bold mt-1">UV INDEX</span>
        </div>
      </div>
    );
}

// 6. RAIN CHART
export function RainChart() {
    return (
        <div className="w-full h-48 relative px-5 pt-8 pb-6 select-none flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
               <path d="M0,50 Q25,10 50,30 T100,20 L100,50 L0,50 Z" fill="#60A5FA" opacity="0.2" />
               <path d="M0,50 Q25,10 50,30 T100,20" fill="none" stroke="#3B82F6" strokeWidth="2" />
            </svg>
            <div className="absolute top-1/2 text-xs text-gray-400 font-medium">Rain Probability</div>
        </div>
    );
}
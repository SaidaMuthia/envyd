import React from 'react';

// ... (WindCompass, FeelsLikeSlider, HumidityBars, VisibilityPyramid yang sudah ada tetap di sini) ...

// 1. Existing: WindCompass
export function WindCompass() {
  return (
    <div className="relative w-24 h-24 border-[3px] border-[#E9EDF7] rounded-full flex items-center justify-center bg-white mt-1">
        <span className="absolute top-1.5 text-[10px] text-gray-400 font-bold">N</span>
        <span className="absolute bottom-1.5 text-[10px] text-gray-400 font-bold">S</span>
        <span className="absolute left-1.5 text-[10px] text-gray-400 font-bold">W</span>
        <span className="absolute right-1.5 text-[10px] text-gray-400 font-bold">E</span>
        <div className="relative w-full h-full flex items-center justify-center" style={{ transform: 'rotate(-45deg)' }}>
            <div className="w-1 h-20 bg-transparent absolute flex flex-col justify-between">
                 <div className="w-1.5 h-2 bg-[#E9EDF7] rounded-full"></div>
                 <div className="w-1.5 h-2 bg-[#E9EDF7] rounded-full"></div>
            </div>
            <div className="w-1.5 h-9 bg-[#4318FF] rounded-full absolute top-4 shadow-sm"></div>
            <div className="w-3 h-3 bg-white border-[3px] border-[#4318FF] rounded-full z-10 shadow-sm"></div>
        </div>
    </div>
  );
}

// 2. Existing: FeelsLikeSlider
export function FeelsLikeSlider({ value }: { value: number }) {
  return (
    <div className="w-full px-1 py-6">
        <div className="relative w-full h-2 bg-[#E9EDF7] rounded-full">
            <div className="absolute left-0 top-0 h-full w-[60%] bg-[#4318FF] rounded-full"></div>
            <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-[#4318FF] rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
    </div>
  );
}

// 3. Existing: HumidityBars
export function HumidityBars() {
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

// 4. Existing: VisibilityPyramid (Disesuaikan agar mirip gambar more.png - Hijau)
export function VisibilityPyramid() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 grow py-2 w-full">
        {/* Layer 1 (Top) */}
        <div className="w-[30%] h-2.5 bg-[#E9EDF7] rounded-full"></div>
        {/* Layer 2 */}
        <div className="w-[50%] h-2.5 bg-[#05CD99] opacity-60 rounded-full"></div>
        {/* Layer 3 */}
        <div className="w-[70%] h-2.5 bg-[#05CD99] opacity-80 rounded-full"></div>
        {/* Layer 4 */}
        <div className="w-[85%] h-2.5 bg-[#05CD99] rounded-full"></div>
        {/* Layer 5 (Base) */}
        <div className="w-full h-2.5 bg-[#2E7D32] rounded-full shadow-sm"></div>
    </div>
  );
}

// 5. BARU: UV Gauge (Visualisasi setengah lingkaran warna-warni)
export function UvGauge() {
    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* SVG Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="transparent"
            stroke="#E9EDF7"
            strokeWidth="10"
          />
          {/* Colored Segments (Simulation) */}
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="transparent"
            stroke="url(#uvGradient)"
            strokeWidth="10"
            strokeDasharray="260 360" // Mengisi sebagian lingkaran
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="uvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFCE47" />
              <stop offset="50%" stopColor="#FF5B5B" />
              <stop offset="100%" stopColor="#4318FF" />
            </linearGradient>
          </defs>
        </svg>
        {/* Value Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-[#1B1B1E]">9</span>
        </div>
        {/* Dot Indicator */}
        <div className="absolute top-2 right-4 w-4 h-4 bg-[#FF5B5B] rounded-full border-2 border-white shadow-md"></div>
      </div>
    );
}

// 6. BARU: Rain Chart (Grafik Batang + Garis)
export function RainChart() {
    const data = [40, 25, 80, 20, 60, 30]; // Tinggi batang
    return (
        <div className="w-full h-40 relative flex items-end justify-between px-2 pt-8">
            {/* Dashed Lines Background */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 px-0 pointer-events-none">
                <div className="w-full border-t border-dashed border-gray-300"></div>
                <div className="w-full border-t border-dashed border-gray-300"></div>
                <div className="w-full border-t border-dashed border-gray-300"></div>
            </div>

            {/* Bars & Points */}
            {data.map((h, i) => (
                <div key={i} className="relative flex flex-col items-center h-full justify-end group w-full">
                    {/* Blue Point on Line (Simulasi) */}
                    <div 
                        className="absolute w-2.5 h-2.5 bg-white border-[2px] border-[#4318FF] rounded-full z-10"
                        style={{ bottom: `${h + 10}%` }}
                    ></div>
                    
                    {/* Bar */}
                    <div 
                        style={{ height: `${h}%` }} 
                        className="w-1.5 bg-[#A3AED0]/30 rounded-t-full group-hover:bg-[#4318FF]/50 transition-colors"
                    ></div>
                    
                    {/* Top Marker (Black Pill) */}
                    <div 
                        className="absolute w-1.5 h-3 bg-[#1B1B1E] rounded-full"
                        style={{ bottom: `${h}%` }}
                    ></div>
                </div>
            ))}
            
            {/* Curved Line (SVG Overlay) - Simplifikasi visual */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path 
                    d="M10,90 C30,110 50,40 90,40 C130,40 150,110 190,110 C230,110 250,60 290,60 C330,60 350,100 370,90" 
                    fill="none" 
                    stroke="#4318FF" 
                    strokeWidth="1" 
                    className="opacity-50"
                    transform="scale(1, -1) translate(0, -140)" // Flip coordinates primitive tweak
                />
            </svg>
        </div>
    );
}
import { Wind } from "lucide-react";

export default function AqiCard() {
  return (
    <div className="bg-white p-8 rounded-[30px] shadow-[0_20px_25px_-5px_rgba(112,144,176,0.1)] w-full h-full min-h-60 flex flex-col justify-between border border-transparent">
       {/* Header */}
       <div className="flex items-center gap-2 mb-4">
         <img src="/images/Aqi_icon.svg" alt="Air Quality Index" />
         <span className="font-bold text-sm text-[#345B92]">Air Quality Index</span>
       </div>

       {/* Gradient Bar */}
       <div className="relative w-full h-3 rounded-full bg-linear-to-r from-[#05CD99] via-[#FFB547] to-[#EE5D50] my-4">
         <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-5 h-5 bg-white border-[3px] border-[#FFB547] rounded-full shadow-lg z-10 cursor-pointer"></div>
       </div>

       {/* Stats */}
       <div className="flex flex-col md:flex-row justify-between items-end mt-4">
         <div>
            <div className="flex items-baseline gap-2">
                <h2 className="text-6xl font-bold text-[#1B1B1E] leading-none">65</h2>
                <span className="text-[#05CD99] font-bold text-xl">Good</span>
            </div>
         </div>
         <div className="max-w-md text-right mt-4 md:mt-0">
            <p className="text-[#1B1B1E] text-sm font-medium leading-relaxed">
                Air quality is satisfactory, and air pollution poses little or no risk. 
            </p>
         </div>
       </div>
       <p className="text-[10px] text-[#A3AED0] mt-4">Data from Station X</p>
    </div>
  );
}
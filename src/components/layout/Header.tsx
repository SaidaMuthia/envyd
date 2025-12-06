// src/components/layout/Header.tsx

"use client";
import { Search, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useLocation } from "@/context/LocationContext";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { activeLocation } = useLocation();

  return (
    <header className="sticky top-4 z-50 w-full transition-all duration-300">
      
      {/* PERBAIKAN LAYOUT MOBILE:
        1. px-3 (sebelumnya px-4) -> Menghemat 8px ruang horizontal.
        2. gap-2 (sebelumnya gap-3) -> Menghemat ruang antar elemen.
      */}
      <div className="w-full flex items-center justify-between bg-[#E5F0FFCC] backdrop-blur-md 
        py-3 px-3 md:py-[9px] md:px-7 md:pr-12 
        rounded-[20px] shadow-sm gap-2 md:gap-6">
      
      {/* 1. BAGIAN KIRI: Logo & Lokasi */}
      <div className="flex items-center gap-2 md:gap-8 shrink-0">
        
        {/* Logo: Sembunyikan teks EnvyD di mobile agar lebih hemat ruang */}
        <div className="flex items-center gap-2">
            <img 
              src="/images/Logo.svg" 
              alt="EnvyD" 
              className="w-8 h-8 md:w-[50px] md:h-[50px] object-contain"
            />
            <span className="font-bold text-[#000000] hidden md:block">EnvyD</span>
        </div>
        
        {/* Lokasi */}
        {/* PERBAIKAN: max-w-[80px] di mobile.
           Ini memaksa teks lokasi '...' lebih cepat muncul saat layar sempit,
           memberikan ruang napas untuk Search Bar agar tidak tertabrak Dark Mode.
        */}
        <div className="flex items-center gap-1.5 md:gap-2 text-[#000000] max-w-20 xs:max-w-[120px] md:max-w-none">
          <img 
            src="/images/Location_icon.svg" 
            alt="Location"
            className="w-4 h-4 md:w-[22px] md:h-[22px] object-contain mt-0.5 shrink-0" 
          />
          <span className="font-bold text-sm md:text-lg truncate">
            {activeLocation.name}
          </span>
        </div>
      </div>

      {/* 2. BAGIAN TENGAH: Search Bar */}
      <div className="flex-1 min-w-0 max-w-2xl">
        <div className="relative group w-full">
          {/* Icon Search */}
          <Search className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2B3674] transition-colors w-4 h-4 md:w-5 md:h-5" />
          
          {/* Input: pl-9 (36px) cukup untuk icon w-4 */}
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-9 pr-3 py-2 md:pl-14 md:pr-6 md:py-3 
              bg-white rounded-full text-xs md:text-sm font-medium text-[#323544] 
              placeholder:text-[#A3AED0] outline-none shadow-sm focus:ring-1 focus:ring-[#2B3674]/20 transition-all"
          />
        </div>
      </div>

      {/* 3. BAGIAN KANAN: Dark Mode */}
      <div className="flex items-center shrink-0">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="relative w-[52px] h-7 md:w-[86px] md:h-[38px] bg-[#1B1B1E] rounded-full flex items-center px-1 transition-all duration-300 shadow-md cursor-pointer overflow-hidden"
        >
          <div className="absolute left-1.5 md:left-3 text-yellow-400">
            <Sun className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" fill="currentColor" />
          </div>
          
          <div className="absolute right-1.5 md:right-3 text-gray-400">
            <Moon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" fill="currentColor" />
          </div>

          <div 
            className={`w-[22px] h-[22px] md:w-[30px] md:h-[30px] bg-white rounded-full shadow-lg z-10 flex items-center justify-center transition-transform duration-300 ease-out 
            ${isDarkMode ? 'translate-x-6 md:translate-x-12' : 'translate-x-0'}`}
          >
             {isDarkMode ? (
               <Moon className="w-3.5 h-3.5 md:w-3.5 md:h-3.5 text-[#2B3674] fill-[#2B3674]" />
             ) : (
               <Sun className="w-3.5 h-3.5 md:w-3.5 md:h-3.5 text-yellow-500 fill-yellow-500" />
             )}
          </div>
        </button>
      </div>

      </div>
    </header>
  );
}
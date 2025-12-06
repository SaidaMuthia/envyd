"use client";
import { Search, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <header className="flex flex-col lg:flex-row items-center justify-between bg-[#E5F0FFCC] py-[9px] pl-7 pr-12 rounded-[20px] shadow-sm mb-8 gap-6 sticky top-8 z-50 backdrop-blur-sm">
      
      {/* Bagian Kiri: Logo & Lokasi */}
      <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-start">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
            <img 
              src="/images/Logo.svg" 
              alt="EnvyD Logo" 
              className="w-[50px] h-[50px] object-contain"
            />
            <span className="font-bold text-[#000000]">EnvyD</span>
        </div>
        
        {/* Lokasi */}
        <div className="flex items-center gap-2 text-[#000000]">
          <img 
            src="/images/Location_icon.svg" 
            alt="Location Icon"
            className="w-[22px] h-[22px] object-contain mt-1" 
          />
          <span className="font-bold text-lg">Makassar, Indonesia</span>
        </div>
      </div>

      {/* Bagian Tengah: Search Bar */}
      <div className="flex-1 max-w-2xl w-full px-0 md:px-4">
        <div className="relative group w-full">
          {/* Icon Search */}
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2B3674] transition-colors" size={20} />
          
          {/* Input Field */}
          <input 
            type="text" 
            placeholder="Search City..." 
            className="w-full pl-14 pr-6 py-3 bg-white rounded-full text-sm font-medium text-[#323544] placeholder:text-[#A3AED0] outline-none shadow-sm focus:ring-2 focus:ring-[#2B3674]/20 transition-all"
          />
        </div>
      </div>

      {/* Bagian Kanan: Tombol Dark Mode */}
      <div className="flex items-center">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="relative w-[86px] h-[38px] bg-[#1B1B1E] rounded-full flex items-center px-1 transition-all duration-300 shadow-md cursor-pointer overflow-hidden"
          aria-label="Toggle Dark Mode"
        >
          <div className="absolute left-3 text-yellow-400">
            <Sun size={18} fill="currentColor" />
          </div>
          
          <div className="absolute right-3 text-gray-400">
            <Moon size={18} fill="currentColor" />
          </div>

          <div 
            className={`w-[30px] h-[30px] bg-white rounded-full shadow-lg z-10 flex items-center justify-center transition-transform duration-300 ease-out ${isDarkMode ? 'translate-x-12' : 'translate-x-0'}`}
          >
             {isDarkMode ? (
               <Moon size={14} className="text-[#2B3674] fill-[#2B3674]" />
             ) : (
               <Sun size={14} className="text-yellow-500 fill-yellow-500" />
             )}
          </div>
        </button>
      </div>

    </header>
  );
}
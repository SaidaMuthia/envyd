"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Search, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <header className="flex flex-col lg:flex-row items-center justify-between bg-[#E9EEF9] py-3 px-6 rounded-[3rem] shadow-sm mb-8 gap-4 sticky top-4 z-50">
      {/* Logo & Location */}
      <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center gap-2">
          {/* Logo Icon Placeholder */}
          <div className="relative w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
             <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
          </div>
          <span className="font-bold text-gray-700 text-lg">EnvyD</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-800 font-bold text-sm md:text-base">
          <MapPin size={18} fill="black" className="text-black" />
          <span>Makassar, Indonesia</span>
        </div>
      </div>

      {/* Search Bar - Center */}
      <div className="flex-1 max-w-2xl w-full px-4">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
          <input 
            type="text" 
            placeholder="Search City..." 
            className="w-full pl-12 pr-6 py-3 bg-white rounded-full text-sm font-medium text-gray-600 outline-none shadow-sm focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Actions - Right (Dark Mode Toggle Only) */}
      <div className="flex items-center">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="relative w-16 h-9 bg-[#2B3674] rounded-full flex items-center px-1 transition-all duration-300 shadow-inner"
        >
          {/* Icons inside the track */}
          <div className="absolute left-2 text-yellow-400"><Sun size={14} /></div>
          <div className="absolute right-2 text-white"><Moon size={14} /></div>

          {/* Moving Circle */}
          <div className={`w-7 h-7 bg-white rounded-full shadow-md z-10 transform transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}>
             {isDarkMode ? <Moon size={14} className="text-[#2B3674]" /> : <Sun size={14} className="text-yellow-500" />}
          </div>
        </button>
      </div>
    </header>
  );
}
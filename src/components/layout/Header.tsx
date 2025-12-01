"use client";
import { Bell, MapPin, Moon, Settings, Search } from "lucide-react";

export default function Header() {
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

      {/* Actions - Right */}
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md">
            <Moon size={18} fill="white" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-transparent hover:bg-white rounded-full transition text-gray-600">
            <Bell size={20} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-transparent hover:bg-white rounded-full transition text-gray-600">
            <Settings size={20} />
        </button>
        {/* Avatar */}
        <div className="w-10 h-10 bg-slate-700 rounded-full ml-2 cursor-pointer border-2 border-white shadow-sm"></div> 
      </div>
    </header>
  );
}
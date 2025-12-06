"use client";

import dynamic from "next/dynamic";

// Import Map secara Dynamic agar tidak error "window is not defined"
const FullInteractiveMap = dynamic(() => import("@/components/map/FullInteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#F4F7FE] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#4318FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2B3674] font-bold animate-pulse">Loading World Map...</p>
    </div>
  )
});

export default function MapPage() {
  return <FullInteractiveMap />;
}
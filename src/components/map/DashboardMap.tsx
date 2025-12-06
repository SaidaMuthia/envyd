// src/components/map/DashboardMap.tsx

"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import Router

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DashboardMapProps {
  onExpand?: () => void;
  isExpanded?: boolean;
}

export default function DashboardMap({ onExpand, isExpanded = false }: DashboardMapProps) {
  const router = useRouter(); // Init router

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [isExpanded]);

  return (
    <div className={`relative w-full rounded-[30px] overflow-hidden shadow-[0_20px_25px_-5px_rgba(112,144,176,0.1)] border border-white z-0 transition-all duration-500 ${isExpanded ? 'h-full' : 'h-[380px]'}`}>
      <MapContainer 
        center={[-5.1477, 119.4327]} 
        zoom={13} 
        scrollWheelZoom={isExpanded} 
        className="h-full w-full"
        zoomControl={false} // Disable zoom control default agar tidak ketutupan tombol
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[-5.1477, 119.4327]} icon={icon}>
          <Popup>Makassar</Popup>
        </Marker>
      </MapContainer>
      
      {/* Tombol View Wide -> Pindah ke Page Map */}
      {!isExpanded && (
        <button 
            onClick={() => router.push('/map')} // NAVIGASI KE HALAMAN BARU
            className="absolute top-6 right-6 bg-white hover:bg-gray-50 text-[#1B2559] px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all z-400 border border-[#F4F7FE] cursor-pointer"
        >
            View Wide
        </button>
      )}
    </div>
  );
}
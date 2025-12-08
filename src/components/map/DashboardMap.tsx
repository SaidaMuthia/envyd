"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
// @ts-ignore
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useLocation } from "@/context/LocationContext"; 
import { Maximize2 } from "lucide-react"; // Tambahkan Icon

// Icon Marker Default
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Helper: Update Posisi Kamera
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);
  return null;
}

// Helper: Handle Klik Peta
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng); 
    },
  });
  return null;
}

interface DashboardMapProps {
  onExpand?: () => void;
  isExpanded?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export default function DashboardMap({ 
    onExpand, 
    isExpanded = false, 
    onLocationSelect 
}: DashboardMapProps) {
    
  const router = useRouter();
  const { activeLocation } = useLocation();

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [isExpanded]);

  const lat = activeLocation.lat || -5.1477;
  const lng = activeLocation.lng || 119.4327;
  const position: [number, number] = [lat, lng]; 

  return (
    <div className={`relative w-full rounded-[30px] overflow-hidden shadow-sm border border-white transition-all duration-500 bg-gray-100 ${isExpanded ? 'h-full' : 'h-[380px]'}`}>
      
      {/* MAP CONTAINER */}
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={isExpanded} 
        className="h-full w-full z-0" 
        zoomControl={false} 
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={position} icon={icon}></Marker>
        <MapUpdater center={position} />
        
        {onLocationSelect && <ClickHandler onMapClick={onLocationSelect} />} 
      </MapContainer>
      
      {/* TOMBOL VIEW WIDE (Layout Diperbaiki) */}
      {!isExpanded && (
        <button 
            onClick={onExpand ? onExpand : () => router.push('/map')} 
            className="absolute top-4 right-4 z-1000 bg-white/90 backdrop-blur-md hover:bg-white text-[#1B2559] pl-4 pr-3 py-2.5 rounded-2xl text-sm font-bold shadow-lg transition-all border border-[#E9EDF7] flex items-center gap-2 group cursor-pointer hover:scale-105 active:scale-95"
        >
            <span>View Wide</span>
            <div className="bg-[#F4F7FE] p-1 rounded-full group-hover:bg-[#E9EDF7] transition-colors">
                <Maximize2 size={14} className="text-[#1B2559]" />
            </div>
        </button>
      )}

    </div>
  );
}
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
// @ts-ignore
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useLocation } from "@/context/LocationContext"; 

// Icon Fix (Tetap Sama)
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Komponen Helper: Menggeser kamera peta (MapUpdater)
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);
  return null;
}

// Komponen Helper: Menangani Klik Peta (ClickHandler)
// Fungsi ini HANYA mengirim koordinat ke fungsi callback di parent (page.tsx)
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
  onLocationSelect?: (lat: number, lng: number) => void; // Prop ini sudah benar
}

export default function DashboardMap({ 
    onExpand, 
    isExpanded = false, 
    onLocationSelect // ⭐️ Ambil prop ini ⭐️
}: DashboardMapProps) { // ⭐️ Hapus '& { onLocationSelect?:... }' di sini karena sudah ada di interface utama
    
  const router = useRouter();
  const { activeLocation } = useLocation(); // Hapus setActiveLocation karena tidak digunakan di sini

  // 🚨 LOGIKA handleMapClick LAMA DIHAPUS 🚨
  
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [isExpanded]);

  // Gunakan koordinat dari Context. Default ke Makassar jika null/0.
  const lat = activeLocation.lat || -5.1477;
  const lng = activeLocation.lng || 119.4327;
  const position: [number, number] = [lat, lng]; 


  return (
    <div className={`relative w-full rounded-[30px] overflow-hidden shadow-[0_20px_25px_-5px_rgba(112,144,176,0.1)] border border-white z-0 transition-all duration-500 ${isExpanded ? 'h-full' : 'h-[380px]'}`}>
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={isExpanded} 
        className="h-full w-full"
        zoomControl={false} 
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={position} icon={icon}></Marker>

        <MapUpdater center={position} />
        
        {/* ⭐️ KOREKSI KRITIS: HANYA PANGGIL CLICKHANDLER JIKA onLocationSelect ADA ⭐️ */}
        {onLocationSelect && <ClickHandler onMapClick={onLocationSelect} />} 
      </MapContainer>
      
      {/* Tombol View Wide ASLI */}
      {!isExpanded && (
        <button 
            onClick={() => router.push('/map')} 
            className="absolute top-6 right-6 bg-white hover:bg-gray-50 text-[#1B2559] px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all z-400 border border-[#F4F7FE] cursor-pointer"
        >
            View Wide
        </button>
      )}
    </div>
  );
}
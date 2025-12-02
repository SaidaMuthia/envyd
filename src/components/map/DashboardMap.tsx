"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  return (
    <div className={`relative w-full rounded-[30px] overflow-hidden shadow-[0_20px_25px_-5px_rgba(112,144,176,0.1)] border border-white z-0 transition-all duration-500 ${isExpanded ? 'h-[80vh]' : 'h-[380px]'}`}>
      <MapContainer center={[-5.1477, 119.4327]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[-5.1477, 119.4327]} icon={icon}>
          <Popup>Makassar</Popup>
        </Marker>
      </MapContainer>
      
      {/* Floating Button "View Wide" / "Close Wide" */}
      <button 
        onClick={onExpand}
        className="absolute bottom-6 right-6 bg-white hover:bg-gray-50 text-[#2B3674] px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all z-400 border border-[#F4F7FE] cursor-pointer"
      >
        {isExpanded ? "Close Map" : "View Wide"}
      </button>
    </div>
  );
}
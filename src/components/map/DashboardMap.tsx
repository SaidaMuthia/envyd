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

export default function DashboardMap() {
  return (
    <div className="relative w-full h-[380px] rounded-[2.5rem] overflow-hidden shadow-sm border border-white z-0">
      <MapContainer center={[-5.1477, 119.4327]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[-5.1477, 119.4327]} icon={icon}>
          <Popup>Makassar</Popup>
        </Marker>
      </MapContainer>
      
      {/* Floating Button "View Wide" */}
      <button className="absolute bottom-6 right-6 bg-[#F4F7FE] hover:bg-white text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all z-400 border border-gray-200">
        View Wide
      </button>
    </div>
  );
}
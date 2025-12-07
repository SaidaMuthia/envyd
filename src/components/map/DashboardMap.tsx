"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
// @ts-ignore
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useLocation } from "@/context/LocationContext"; 

// 1. Import Context

// Icon Fix (Tetap Sama)
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 2. Helper Component: Agar peta bisa "Terbang" ke lokasi baru saat context berubah
// (Komponen ini tidak merender UI apa-apa, hanya logic pergerakan kamera)
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);
  return null;
}

function MapClickHandler() {
  const { setActiveLocation } = useLocation();

  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      console.log(`Peta diklik di: Lat: ${lat}, Lng: ${lng}`);

      // 1. Panggil API Reverse Geocode untuk mencari lokasi terdekat
      try {
        const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Gagal reverse geocode:", errorData.error);
          alert("Lokasi tidak ditemukan di database cuaca terdekat.");
          return;
        }

        const data = await response.json();
        const nearest = data.location;
        
        // 2. Perbarui Context! Ini akan memicu MapUpdater & LocationContext (fetch data cuaca baru)
        setActiveLocation({
          name: nearest.name,
          adm4: nearest.adm4, // Kunci untuk fetch data cuaca
          lat: nearest.lat,
          lng: nearest.lon,
        });

        console.log(`Lokasi terdekat ditemukan: ${nearest.name} (${nearest.adm4})`);

      } catch (error) {
        console.error("Error fetching reverse geocode:", error);
        alert("Terjadi kesalahan saat mencari lokasi.");
      }
    },
  });

  return null; 
}

interface DashboardMapProps {
  onExpand?: () => void;
  isExpanded?: boolean;
}

export default function DashboardMap({ onExpand, isExpanded = false }: DashboardMapProps) {
  const router = useRouter();
  const { activeLocation } = useLocation(); // 3. Ambil data lokasi real

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [isExpanded]);

  // Gunakan koordinat dari Context. Default ke Makassar jika null/0.
  const lat = activeLocation.lat || -5.1477;
  const lng = activeLocation.lng || 119.4327;

  return (
    // CLASSNAME ASLI DIPERTAHANKAN
    <div className={`relative w-full rounded-[30px] overflow-hidden shadow-[0_20px_25px_-5px_rgba(112,144,176,0.1)] border border-white z-0 transition-all duration-500 ${isExpanded ? 'h-full' : 'h-[380px]'}`}>
      <MapContainer 
        center={[lat, lng]} 
        zoom={13} 
        scrollWheelZoom={isExpanded} 
        className="h-full w-full"
        zoomControl={false} 
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marker Dinamis */}
        <Marker position={[lat, lng]} icon={icon}>
          <Popup>{activeLocation.name}</Popup>
        </Marker>

        {/* Logic Update Posisi */}
        <MapUpdater center={[lat, lng]} />
        <MapClickHandler />
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
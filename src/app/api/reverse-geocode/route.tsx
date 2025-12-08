import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
// ⭐️ Ganti import kdTree yang lama ⭐️
import { kdTree } from 'kd-tree-javascript';

// --- Type Definitions ---
// Catatan: Pastikan tipe ini konsisten
type CityLocation = {
  adm4: string;
  lat: number;
  lon: number;
  name: string;
};

// --- Fungsi Jarak (Dipertahankan dan digunakan oleh KDTree) ---
// Fungsi ini HARUS menerima dua objek titik (point1, point2) dan mengembalikan jarak (Km).
// Kita menggunakan rumus Haversine/Euclidean sederhana Anda.
function distance(point1: CityLocation, point2: CityLocation): number {
  const R = 6371; // Radius Bumi dalam km
  // KDTree akan otomatis menggunakan properti yang Anda tentukan ('lat', 'lon')
  const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
  const dLon = (point2.lon - point1.lon) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * (Math.PI / 180)) * Math.cos(point2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Jarak dalam km
  return d;
}

// --- Membaca Data cities.json Sekali Saat Server Startup ---
const citiesPath = path.join(process.cwd(), 'data', 'cities.json');
let kdTreeInstance: any = null; // Tipe diset 'any' karena kd-tree-javascript tidak memiliki tipe TypeScript bawaan

try {
  const fileContents = fs.readFileSync(citiesPath, 'utf8');
  const rawData = JSON.parse(fileContents);
  
  // Memfilter dan mengkonversi data agar kompatibel
  const citiesData: CityLocation[] = rawData.map((city: any) => ({
    adm4: city.adm4,
    name: city.name,
    lat: parseFloat(city.lat),
    lon: parseFloat(city.lon) // Gunakan 'lon' agar sesuai dengan 'lat' dan 'lon'
  })).filter((city: CityLocation) => !isNaN(city.lat) && !isNaN(city.lon));

  // ⭐️ BANGUN K-D TREE (HANYA SEKALI) ⭐️
  // Constructor: (array_of_points, distance_function, array_of_dimensions)
  kdTreeInstance = new kdTree(citiesData, distance, ['lat', 'lon']);
  
  console.log(`✅ Successfully loaded ${citiesData.length} cities.`);
  console.log("✅ K-D Tree built successfully for fast geo-search.");
} catch (e) {
  console.error("❌ CRITICAL ERROR: Failed to load cities.json or build KDTree. Check file path and format.", e);
}


// --- GET Handler ---
export async function GET(req: NextRequest) {
  // 1. Validasi Data Loading
  if (!kdTreeInstance) {
      return NextResponse.json({ error: "Search index not ready (KDTree failed to load)." }, { status: 500 });
  }

  // 2. Ambil Query Params
  const { searchParams } = new URL(req.url);
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  
  const lat = parseFloat(latParam || '');
  const lng = parseFloat(lngParam || '');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Invalid lat or lng format." }, { status: 400 });
  }
  
  // 3. ⭐️ PENCARIAN KDTree (JAUH LEBIH CEPAT) ⭐️
  // Titik target harus memiliki struktur yang sama dengan data di tree.
  const targetPoint = { lat: lat, lon: lng, name: '', adm4: '' }; 
  
  // Mencari 1 lokasi terdekat dari titik klik (Result: [[point, distance], ...])
  const nearestResults = kdTreeInstance.nearest(targetPoint, 1); 

  if (nearestResults.length > 0) {
      // Hasil dari nearestResults adalah array: [[nearestPoint, distanceValue]]
      const nearestCity: CityLocation = nearestResults[0][0]; 
      const minDistance = nearestResults[0][1]; // Jarak sudah dihitung oleh KDTree
      
      // Batas Jarak 150 km
      if (minDistance < 150) { 
          return NextResponse.json({ 
              location: {
                adm4: nearestCity.adm4,
                lat: nearestCity.lat,
                lon: nearestCity.lon,
                name: nearestCity.name
              }, 
              distance: minDistance 
          });
      }
  }

  // 4. Kirim Respon Error jika tidak ditemukan dalam batas 150 km
  return NextResponse.json({ error: "Location not found nearby (Min Distance > 150km)" }, { status: 404 });
}
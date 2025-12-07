//

import { NextRequest, NextResponse } from "next/server";
import citiesData from "@/data/cities.json"; 

type City = {
  name: string;
  adm4: string;
  lat: number;
  lon: number;
};

const cities = citiesData as City[];

// Helper: Haversine formula (Tetap dipakai untuk cari weather station terdekat)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toUpperCase();

  if (!query || query.length < 3) {
    return NextResponse.json({ results: [] });
  }

  const results = cities
    .filter((city) => city.name.toUpperCase().includes(query))
    .slice(0, 10);

  return NextResponse.json({ results });
}

// POST: Reverse Geocoding (Hybrid: Nominatim + Local Cities)
export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json();

    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
    }

    // 1. CARI NAMA LOKASI AKURAT (via Nominatim OpenStreetMap)
    // Ini akan memberikan nama jalan/kelurahan/kecamatan yang presisi
    let preciseName = "";
    try {
        const nominatimRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`, 
            { headers: { 'User-Agent': 'EnvydApp/1.0' } } // User-agent wajib untuk Nominatim
        );
        
        if (nominatimRes.ok) {
            const nominatimData = await nominatimRes.json();
            // Ambil nama daerah (Kecamatan/Kota) atau display_name penuh
            const addr = nominatimData.address;
            // Prioritas nama: Kecamatan -> Kota -> Kabupaten -> Nama Full
            preciseName = addr.village || addr.town || addr.city || addr.county || nominatimData.name || "";
        }
    } catch (e) {
        console.warn("Nominatim fetch failed, falling back to nearest city name");
    }

    // 2. CARI TITIK BMKG TERDEKAT (Untuk Data Cuaca)
    // Kita tetap butuh ini karena BMKG cuma terima kode adm4 dari daftar yang terdaftar
    let nearest = cities[0];
    let minDistance = calculateDistance(lat, lng, cities[0].lat, cities[0].lon);

    for (let i = 1; i < cities.length; i++) {
      const city = cities[i];
      const distance = calculateDistance(lat, lng, city.lat, city.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = city;
      }
    }

    // 3. GABUNGKAN HASIL
    // Gunakan nama dari Nominatim (jika ada) untuk ditampilkan ke user,
    // tapi gunakan adm4 dari 'nearest' untuk query cuaca.
    return NextResponse.json({
      name: preciseName || nearest.name, // Nama lebih akurat
      adm4: nearest.adm4,                // Kode wilayah untuk BMKG (wajib)
      lat: lat,                          // Lat/Lng asli user (bukan posisi stasiun cuaca)
      lng: lng,
      distance: minDistance,
      nearestStation: nearest.name       // Info tambahan: stasiun cuaca yang dipakai
    });

  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
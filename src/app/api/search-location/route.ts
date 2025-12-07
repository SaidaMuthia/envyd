import { NextRequest, NextResponse } from "next/server";
// Pastikan path ini sesuai dengan lokasi file json kamu
import citiesData from "@/data/cities.json"; 

type City = {
  name: string;
  adm4: string;
  lat: number;
  lon: number;
};

// Cast JSON to typed array once
const cities = citiesData as City[];

// Helper: Haversine formula untuk hitung jarak
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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

  // Filter limit 10 hasil agar ringan
  const results = cities
    .filter((city) => city.name.toUpperCase().includes(query))
    .slice(0, 10);

  return NextResponse.json({ results });
}

// POST untuk reverse geocoding (cari lokasi terdekat dari koordinat)
export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json();

    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
    }

    // Cari lokasi terdekat
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

    return NextResponse.json({
      name: nearest.name,
      adm4: nearest.adm4,
      lat: nearest.lat,
      lng: nearest.lon,
      distance: minDistance
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
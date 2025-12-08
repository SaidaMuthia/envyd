import { NextRequest, NextResponse } from "next/server";
// Pastikan path ini sesuai dengan lokasi file json kamu
import citiesData from "@/data/cities.json"; 

// UPDATE: Sesuaikan tipe dengan data asli di JSON (number)
type City = {
  name: string;
  adm4: string;
  lat: number; 
  lon: number;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toUpperCase();

  if (!query || query.length < 3) {
    return NextResponse.json({ results: [] });
  }

  // Filter limit 15 hasil agar ringan
  const results = (citiesData as City[])
    .filter((city) => city.name.toUpperCase().includes(query))
    .slice(0, 15);

  return NextResponse.json({ results: results.map(city => ({
    name: city.name,
    adm4: city.adm4,
    // Kita kirim sebagai number (lebih standar untuk koordinat)
    // Jika frontend WAJIB string, ubah jadi: String(city.lat)
    lat: city.lat,
    lon: city.lon,
  })) });
}
import { NextRequest, NextResponse } from "next/server";
import citiesData from "@/data/cities.json"; 

// PERBAIKAN: Ubah tipe lat & lon menjadi number sesuai isi JSON
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
  // Casting 'as City[]' aman karena kita sudah sesuaikan tipe di atas
  const results = (citiesData as City[])
    .filter((city) => city.name.toUpperCase().includes(query))
    .slice(0, 15);

  return NextResponse.json({ results: results.map(city => ({
    name: city.name,
    adm4: city.adm4,
    lat: city.lat,
    lon: city.lon,
  })) });
}
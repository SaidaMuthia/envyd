import { NextRequest, NextResponse } from "next/server";
import citiesData from "@/data/cities.json"; 

type City = {
  name: string;
  adm4: string;
  lat: string;
  lon: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toUpperCase();

  if (!query || query.length < 3) {
    return NextResponse.json({ results: [] });
  }

  // Filter limit 10 hasil agar ringan
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
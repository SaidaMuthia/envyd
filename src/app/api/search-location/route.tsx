import { NextRequest, NextResponse } from "next/server";
// Pastikan path ini sesuai dengan lokasi file json kamu
import citiesData from "@/data/cities.json"; 

type City = {
  name: string;
  adm4: string;
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
    .slice(0, 10);

  return NextResponse.json({ results });
}
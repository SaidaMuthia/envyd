import citiesDataRaw from "@/data/cities.json";

// Sesuaikan interface dengan JSON Anda
export interface City {
  id: number;
  name: string;
  lat: number;
  lon: number;
  adm4?: string; // Tambahan jika nanti ada
}

const cities = citiesDataRaw as unknown as City[];

// Fungsi Mencari Kota Terdekat (Algoritma Magnet)
export const findNearestCity = (latitude: number, longitude: number): City => {
  let nearest = cities[0];
  let minDistance = Infinity;

  cities.forEach((city) => {
    // Rumus Haversine (atau Pythagoras sederhana untuk performa UI)
    // Di sini pakai Euclidean distance sederhana (cukup akurat untuk snapping UI)
    const distance = Math.sqrt(
      Math.pow(city.lat - latitude, 2) + Math.pow(city.lon - longitude, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  });

  return nearest;
};
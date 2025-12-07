import { NextRequest, NextResponse } from "next/server";

// --- PENTING: MEMATIKAN CACHE NEXT.JS ---
export const dynamic = 'force-dynamic'; 
export const revalidate = 0;

// --- Helper Functions ---
function getAqiStatus(aqi: number) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function parseCondition(desc: string) {
  const d = (desc || "").toLowerCase();
  if (d.includes("cerah berawan")) return "Partly Cloudy";
  if (d.includes("berawan")) return "Cloudy";
  if (d.includes("hujan")) return "Rain";
  if (d.includes("cerah")) return "Sunny";
  return "Partly Cloudy";
}

function calculateFeelsLike(t: number, h: number) {
  return Math.round(t + 0.33 * h * 0.1); 
}
function parseWindDirection(code: string) {
    const d = (code || "").toUpperCase();
    switch (d) {
        case 'N': return 'North';
        case 'NNE': return 'North-Northeast';
        case 'NE': return 'Northeast';
        case 'ENE': return 'East-Northeast';
        case 'E': return 'East';
        case 'ESE': return 'East-Southeast';
        case 'SE': return 'Southeast';
        case 'SSE': return 'South-Southeast';
        case 'S': return 'South';
        case 'SSW': return 'South-Southwest';
        case 'SW': return 'Southwest';
        case 'WSW': return 'West-Southwest';
        case 'W': return 'West';
        case 'WNW': return 'West-Northwest';
        case 'NW': return 'Northwest';
        case 'NNW': return 'North-Northwest';
        default: return d; // Kembalikan kode jika tidak dikenal
    }
}

// ⭐️ FUNGSI BARU: Mencari Suhu Min/Max Harian dari data BMKG ⭐️
function findDailyMinMax(dayData: any[]) {
    let min = Infinity;
    let max = -Infinity;
    
    // Iterasi semua periode waktu (per 3 jam) dalam satu hari
    dayData.forEach(period => {
        const temp = parseInt(period.t); // Suhu adalah properti 't'
        if (!isNaN(temp)) {
            if (temp < min) min = temp;
            if (temp > max) max = temp;
        }
    });
    
    // Jika tidak ada data suhu yang valid, gunakan nilai default
    return { 
        low: min === Infinity ? 24 : min, 
        high: max === -Infinity ? 32 : max 
    };
}


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adm4 = searchParams.get("adm4");

    if (!adm4) return NextResponse.json({ error: "No ADM4" }, { status: 400 });

    // 1. Fetch BMKG (No Store Cache)
    const bmkgRes = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4}`, { 
        cache: 'no-store' 
    });
    const bmkgJson = await bmkgRes.json();
    const dataLokasi = bmkgJson?.data?.[0];
    const cuaca = dataLokasi?.cuaca;

    if (!cuaca) return NextResponse.json({ error: "No Data" }, { status: 404 });

    // 2. Fetch OPEN-METEO (Tanpa Token, Murni Koordinat, No Cache)
    let aqiData = { aqi: 0, status: "-" };
    let uvIndex = 0; 

    if (dataLokasi?.lokasi?.lat && dataLokasi?.lokasi?.lon) {
      try {
        // Perbaikan tipe data di sini sudah diterapkan dari langkah sebelumnya
        const lat = parseFloat(String(dataLokasi.lokasi.lat).replace(',', '.'));
        const lon = parseFloat(String(dataLokasi.lokasi.lon).replace(',', '.'));

        // URL Open-Meteo
        const omUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,uv_index&timezone=auto`;
        
        console.log("Fetching Realtime:", omUrl);

        // Fetch dengan no-store agar selalu data baru
        const omRes = await fetch(omUrl, { cache: 'no-store' });
        const omJson = await omRes.json();
        
        if (omJson.current) {
          const valAqi = omJson.current.us_aqi;
          const valUv = omJson.current.uv_index;

          aqiData = {
            aqi: valAqi,
            status: getAqiStatus(valAqi)
          };
          uvIndex = valUv;
          
          console.log(`✅ DATA BARU DIDAPAT: AQI ${valAqi}, UV ${valUv}`);
        }
      } catch (e) { 
        console.error("Open-Meteo Error:", e);
      }
    }

    // 3. Transform Data
    // ⭐️ Ambil Min/Max untuk hari ini ⭐️
    const todayMinMax = findDailyMinMax(cuaca[0]); 
    
    const now = cuaca[0][0]; 
    const currentWeather = {
      temp: parseInt(now.t),
      condition: parseCondition(now.weather_desc),
      low: todayMinMax.low, // ⭐️ Diambil dari hasil perhitungan
      high: todayMinMax.high, // ⭐️ Diambil dari hasil perhitungan

      windSpeed: parseInt(now.ws),
      windDirCode: now.wd,
      windDir: parseWindDirection(now.wd),
      feelsLike: calculateFeelsLike(parseInt(now.t), parseInt(now.hu)),
      humidity: parseInt(now.hu),
      visibility: parseInt(now.vs) / 1000, 
      
      aqi: aqiData.aqi,
      aqiStatus: aqiData.status,
      uv: uvIndex, 
      time: now.local_datetime
    };

    const forecastList = cuaca.map((dayData: any[]) => {
      const d = dayData[0];
      // ⭐️ Ambil Min/Max untuk hari ini ⭐️
      const dailyMinMax = findDailyMinMax(dayData); 
      
      return {
        day: new Date(d.local_datetime).toLocaleDateString("en-US", { weekday: "short" }),
        full: new Date(d.local_datetime).toLocaleDateString("en-US", { weekday: "long" }),
        condition: parseCondition(d.weather_desc),
        temp: parseInt(d.t),
        low: dailyMinMax.low, // ⭐️ Diambil dari hasil perhitungan
        high: dailyMinMax.high, // ⭐️ Diambil dari hasil perhitungan
        rain: false, 
        wind: parseInt(d.ws), 
        windDirCode: d.wd,
        windDir: parseWindDirection(d.wd),
        visibility: parseInt(d.vs) / 1000,
        humidity: parseInt(d.hu), 
        feelsLike: calculateFeelsLike(parseInt(d.t), parseInt(d.hu)), 
        uv: 0,
    
      };
    });

    return NextResponse.json({
      current: currentWeather,
      forecast: forecastList,
      location: dataLokasi.lokasi
    });

  } catch (err) {
    console.error("Fatal Weather API Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
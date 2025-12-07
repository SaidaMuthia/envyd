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
        const lat = parseFloat(dataLokasi.lokasi.lat.replace(',', '.'));
        const lon = parseFloat(dataLokasi.lokasi.lon.replace(',', '.'));

        // URL Open-Meteo
        const omUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,uv_index&timezone=auto`;
        
        console.log("Fetching Realtime:", omUrl);

        // Fetch dengan no-store agar selalu data baru
        const omRes = await fetch(omUrl, { cache: 'no-store' });
        const omJson = await omRes.json();
        
        if (omJson.current) {
          const valAqi = omJson.current.us_aqi ?? null;
          const valUv = omJson.current.uv_index ?? null;

          // Hanya update jika ada data valid
          if (valAqi !== null) {
            aqiData = {
              aqi: valAqi,
              status: getAqiStatus(valAqi)
            };
          }
          
          if (valUv !== null && valUv !== undefined) {
            uvIndex = valUv;
          }
          
          console.log(`✅ DATA BARU DIDAPAT: AQI ${valAqi}, UV ${valUv}`);
        } else {
          console.log("⚠️ Open-Meteo tidak return current data");
        }
      } catch (e) { 
        console.error("Open-Meteo Error:", e);
        // uvIndex tetap 0 jika error
      }
    } else {
      console.log("⚠️ Lokasi lat/lon tidak valid");
    }

    // 3. Transform Data
    const now = cuaca[0][0];
    
    // Calculate min/max temperature untuk hari ini
    let minTemp = parseInt(now.t);
    let maxTemp = parseInt(now.t);
    cuaca[0].forEach((hourData: any) => {
      const temp = parseInt(hourData.t);
      if (temp < minTemp) minTemp = temp;
      if (temp > maxTemp) maxTemp = temp;
    });
    
    const currentWeather = {
      temp: parseInt(now.t),
      condition: parseCondition(now.weather_desc),
      low: minTemp,
      high: maxTemp,
      windSpeed: parseInt(now.ws),
      windDir: now.wd,
      feelsLike: calculateFeelsLike(now.t, now.hu),
      humidity: parseInt(now.hu),
      visibility: parseInt(now.vs) / 1000, 
      
      aqi: aqiData.aqi,
      aqiStatus: aqiData.status,
      uv: uvIndex, 
      time: now.local_datetime
    };

    const forecastList = cuaca.map((dayData: any[], index: number) => {
      const d = dayData[0];
      
      // Calculate min/max temperature untuk hari ini
      let minTemp = parseInt(d.t);
      let maxTemp = parseInt(d.t);
      dayData.forEach((hourData: any) => {
        const temp = parseInt(hourData.t);
        if (temp < minTemp) minTemp = temp;
        if (temp > maxTemp) maxTemp = temp;
      });
      
      // Deteksi hujan dari data BMKG
      let hasRain = false;
      let totalRainfall = 0;
      
      // Cek semua jam dalam hari ini untuk curah hujan
      dayData.forEach((hourData: any) => {
        const rainfall = parseFloat(hourData.ch || 0); // ch = curah hujan
        if (rainfall > 0) hasRain = true;
        totalRainfall += rainfall;
      });
      
      // Generate label hari dengan "Today" untuk hari pertama
      const date = new Date(d.local_datetime);
      const isToday = index === 0;
      const dayLabel = isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
      const fullLabel = isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" });
      
      return {
        day: dayLabel,
        full: fullLabel,
        condition: parseCondition(d.weather_desc),
        temp: parseInt(d.t),
        low: minTemp,
        high: maxTemp,
        rain: hasRain, 
        rainfall: totalRainfall, // Total mm untuk hari tersebut
        wind: parseInt(d.ws), 
        humidity: parseInt(d.hu), 
        feelsLike: 30,
        hourlyRainfall: dayData.map((h: any) => ({ time: h.local_datetime, rainfall: parseFloat(h.ch || 0) }))
      };
    });

    // Jika forecast kurang dari 7 hari, extend dengan placeholder untuk 7 hari ke depan
    const extendedForecast = [...forecastList];
    if (extendedForecast.length < 7) {
      const startDate = new Date(cuaca[0][0].local_datetime);
      for (let i = extendedForecast.length; i < 7; i++) {
        const futureDate = new Date(startDate);
        futureDate.setDate(futureDate.getDate() + i);
        extendedForecast.push({
          day: futureDate.toLocaleDateString("en-US", { weekday: "short" }),
          full: futureDate.toLocaleDateString("en-US", { weekday: "long" }),
          condition: "Partly Cloudy",
          temp: 28,
          low: 24,
          high: 32,
          rain: false,
          rainfall: 0,
          wind: 10,
          humidity: 65,
          feelsLike: 28,
          hourlyRainfall: []
        });
      }
    }

    return NextResponse.json({
      current: currentWeather,
      forecast: extendedForecast,
      location: dataLokasi.lokasi
    });

  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
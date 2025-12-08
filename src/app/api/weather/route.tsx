import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; 
export const revalidate = 0;

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
        default: return d;
    }
}

function findDailyMinMax(dayData: any[]) {
    let min = Infinity;
    let max = -Infinity;
    dayData.forEach(period => {
        const temp = parseInt(period.t);
        if (!isNaN(temp)) {
            if (temp < min) min = temp;
            if (temp > max) max = temp;
        }
    });
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

    const bmkgRes = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4}`, { 
        cache: 'no-store' 
    });
    const bmkgJson = await bmkgRes.json();
    const dataLokasi = bmkgJson?.data?.[0];
    const cuaca = dataLokasi?.cuaca;

    if (!cuaca) return NextResponse.json({ error: "No Data" }, { status: 404 });

    // Open-Meteo AQI & UV
    let aqiData = { aqi: 0, status: "-" };
    let uvIndex = 0; 
    if (dataLokasi?.lokasi?.lat && dataLokasi?.lokasi?.lon) {
      try {
        const lat = parseFloat(String(dataLokasi.lokasi.lat).replace(',', '.'));
        const lon = parseFloat(String(dataLokasi.lokasi.lon).replace(',', '.'));
        const omUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,uv_index&timezone=auto`;
        const omRes = await fetch(omUrl, { cache: 'no-store' });
        const omJson = await omRes.json();
        if (omJson.current) {
          aqiData = { aqi: omJson.current.us_aqi, status: getAqiStatus(omJson.current.us_aqi) };
          uvIndex = omJson.current.uv_index;
        }
      } catch (e) { console.error("Open-Meteo Error:", e); }
    }

    const nowTime = new Date();
    
    // Pilih slot waktu terdekat dengan JAM SEKARANG (untuk Today)
    const getBestSlot = (slots: any[], isCurrentDay: boolean) => {
        if (!slots || slots.length === 0) return null;
        let best = slots[0];
        let minDiff = Infinity;
        slots.forEach((s: any) => {
            const t = new Date(s.local_datetime);
            let diff;
            if (isCurrentDay) {
                diff = Math.abs(t.getTime() - nowTime.getTime());
            } else {
                // Untuk besok, ambil slot siang (jam 12)
                const target = new Date(t);
                target.setHours(12, 0, 0, 0);
                diff = Math.abs(t.getTime() - target.getTime());
            }
            if (diff < minDiff) { minDiff = diff; best = s; }
        });
        return best;
    };

    // Current Weather Logic
    const todaySlots = cuaca[0];
    const currentSlot = getBestSlot(todaySlots, true);
    const now = currentSlot || todaySlots[0];
    const todayMinMax = findDailyMinMax(todaySlots); 

    // Format Waktu Current
    const nowObj = new Date(now.local_datetime);
    const nowTimeString = nowObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });

    const currentWeather = {
      temp: parseInt(now.t),
      condition: parseCondition(now.weather_desc),
      low: todayMinMax.low,
      high: todayMinMax.high,
      windSpeed: parseInt(now.ws),
      windDirCode: now.wd,
      windDir: parseWindDirection(now.wd),
      feelsLike: calculateFeelsLike(parseInt(now.t), parseInt(now.hu)),
      humidity: parseInt(now.hu),
      visibility: parseInt(now.vs) ? parseInt(now.vs)/1000 : 0, 
      aqi: aqiData.aqi,
      aqiStatus: aqiData.status,
      uv: uvIndex, 
      time: nowTimeString
    };

    // Forecast List Logic
    const forecastList = cuaca.map((dayData: any[], index: number) => {
      const isToday = index === 0;
      const d = getBestSlot(dayData, isToday) || dayData[0];
      const dailyMinMax = findDailyMinMax(dayData); 
      
      const date = new Date(d.local_datetime);
      
      const timeString = date.toLocaleTimeString("en-US", { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
      });

      return {
        day: isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" }),
        full: isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" }),
        weekday: date.toLocaleDateString("en-US", { weekday: 'long' }),
        dateDisplay: date.toLocaleDateString("en-US", { day: 'numeric', month: 'short' }),
        
        time: timeString,
        
        condition: parseCondition(d.weather_desc),
        temp: parseInt(d.t),
        low: dailyMinMax.low,
        high: dailyMinMax.high,
        rain: false, 
        wind: parseInt(d.ws), 
        windDirCode: d.wd,
        windDir: parseWindDirection(d.wd),
        visibility: parseInt(d.vs) ? parseInt(d.vs)/1000 : 0,
        humidity: parseInt(d.hu), 
        feelsLike: calculateFeelsLike(parseInt(d.t), parseInt(d.hu)), 
        uv: 0,
        hourlyRainfall: dayData.map((h: any) => ({ 
            time: new Date(h.local_datetime).toLocaleTimeString("en-US", { hour: 'numeric', hour12: true }),
            rainfall: parseFloat(h.ch) || 0 
        }))
      };
    });

    return NextResponse.json({
      current: currentWeather,
      forecast: forecastList, 
      location: dataLokasi.lokasi
    });

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
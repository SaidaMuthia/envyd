export interface WeatherData {
  temp: number;
  condition: string;
  low: number;
  high: number;
  windSpeed: number;
  windDir: string;
  feelsLike: number;
  humidity: number;
  visibility: number;
  aqi: number;
  aqiStatus: string;
  uv?: number; // Tambahan field UV (opsional agar aman)
  time?: string;
}

export interface ForecastItem {
  day: string;  
  full: string; 
  condition: string;
  temp: number;
  low: number;
  high: number;
  rain: boolean;
  rainfall?: number; // Total curah hujan per hari (mm)
  hourlyRainfall?: Array<{ time: string; rainfall: number }>; // Curah hujan per jam
  wind: number;
  humidity: number;
  feelsLike: number;
}
//

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
  uv?: number;
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
  wind: number;
  humidity: number;
  feelsLike: number;
  windDirCode: string; 
  windDir: string;
  visibility: number;
  uv: number;
  hourlyRainfall?: Array<{ time: string; rainfall: number }>;
  time?: string; 
}
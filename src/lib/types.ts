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
}

export interface ForecastData {
  day: string;
  temp: number;
  icon: string; // 'sun' | 'cloud' | 'rain'
}
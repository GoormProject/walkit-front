import { useEffect, useState } from 'react';

export interface WeatherInfo {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed?: number;
  icon: string;
}

export const useWeather = () => {
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    city: '고양시',
    temperature: 29,
    humidity: 74,
    condition: '대체로 맑음',
    windSpeed: 3.5,
    icon: '☀️',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchWeather = async (lat: number, lng: number) => {
      try {
        setIsLoading(true);

        const res = await fetch(`${API_BASE_URL}/api/weather?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error('API 응답 오류');

        const result = await res.json();
        console.log('📦 날씨 정보:', result);
        const data = result.data;

        // TODO: 실제 API 응답 구조에 맞게 매핑
        setWeatherInfo({
          city: data.adminAreaName || '알 수 없음',
          temperature: data.current.temperature || 0,
          humidity: data.current.humidity || 0,
          condition: data.current.weather || '정보 없음',
          windSpeed: data.current.windSpeed || 0,
          icon: getWeatherIcon(data.current.weather) || '❓',
        });
      } catch (err) {
        setError('날씨 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!navigator.geolocation) {
      setError('브라우저에서 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.error(err);
        setError('위치 정보 접근이 거부되었습니다.');
      }
    );
  }, [API_BASE_URL]);

  return { weatherInfo, isLoading, error };
};

export const getWeatherIcon = (condition: string): string => {
  switch (condition) {
    case '맑음':
      return '☀️';
    case '비':
      return '🌧️';
    case '비/눈':
      return '🌨️';
    case '눈':
      return '❄️';
    case '소나기':
      return '🌦️';
    case '알 수 없음':
    default:
      return '❓';
  }
};

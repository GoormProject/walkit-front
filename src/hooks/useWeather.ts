import { useEffect, useState } from 'react';

export interface WeatherInfo {
  city: string;
  clouds: number;
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed?: number;
  icon: string;
}

export const useWeather = () => {
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    city: '고양시',
    clouds: 0,
    temperature: 29,
    humidity: 74,
    condition: '대체로 맑음',
    windSpeed: 3.5,
    icon: '☀️',
  });
  const [threeHourLater, setThreeHourLater] = useState<WeatherInfo | null>(null);
  const [tomorrow, setTomorrow] = useState<WeatherInfo | null>(null);
  const [dayAfterTomorrow, setDayAfterTomorrow] = useState<WeatherInfo | null>(null);
  const [threeDaysLater, setThreeDaysLater] = useState<WeatherInfo | null>(null);

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

        setWeatherInfo(extractWeatherInfo(data, 'current'));
        setThreeHourLater(extractWeatherInfo(data, 'after3hours'));
        setTomorrow(extractWeatherInfo(data, 'tomorrow'));
        setDayAfterTomorrow(extractWeatherInfo(data, 'dayAfterTomorrow'));
        setThreeDaysLater(extractWeatherInfo(data, 'threeDaysLater'));

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

  return {
    weatherInfo,
    threeHourLater,
    tomorrow,
    dayAfterTomorrow,
    threeDaysLater,
    isLoading,
    error,
    getCloudDescription
  };  
};

const extractWeatherInfo = (data: any, key: string): WeatherInfo => {
  const source = data[key] || {};
  return {
    city: data.adminAreaName || '알 수 없음',
    clouds: source.clouds || 0,
    temperature: source.temperature || 0,
    humidity: source.humidity || 0,
    condition: source.weather || '정보 없음',
    windSpeed: source.windSpeed || 0,
    icon: getWeatherIcon(source.weather) || '❓',
  };
};

export const getWeatherIcon = (condition: string): string => {
  console.log('🌤️ 날씨 아이콘:', condition);
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

const getCloudDescription = (clouds: number): string | null => {
  switch (clouds) {
    case -1:
      return null;
    case 1:
      return '맑음';
    case 2:
      return '약간 흐림';
    case 3:
      return '흐림';
    case 4:
      return '매우 흐림';
    default:
      return null;
  }
};

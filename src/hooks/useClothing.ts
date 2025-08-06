import { useEffect, useState } from 'react';

export interface ClothingRecommendation {
  recommendation: string[];
}

export const useClothing = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isClothingLoading, setIsClothingLoading] = useState(false);
  const [clothingError, setClothingError] = useState<null | string>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchRecommendation = async (lat: number, lng: number) => {
      try {
        setIsClothingLoading(true);

        const res = await fetch(`${API_BASE_URL}/api/weather/clothing?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error('API 응답 오류');

        const result = await res.json();
        console.log('🧥 옷차림 추천:', result);

        setRecommendations(result.data?.recommendations || []);
      } catch (err) {
        setClothingError('옷차림 추천 정보를 불러오지 못했습니다.');
      } finally {
        setIsClothingLoading(false);
      }
    };

    if (!navigator.geolocation) {
      setClothingError('브라우저에서 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchRecommendation(latitude, longitude);
      },
      (err) => {
        console.error(err);
        setClothingError('위치 정보 접근이 거부되었습니다.');
      }
    );
  }, [API_BASE_URL]);

  return {
    recommendations,
    isClothingLoading,
    clothingError,
    translateClothing,
  };
};

export const translateClothing = (item: string): string => {
  const map: Record<string, string> = {
    Cap: '모자',
    Beanie: '비니',
    Sunglasses: '선글라스',
    Singlet: '민소매',
    TShirt: '반팔',
    LongSleeveShirt: '긴팔',
    Jacket: '자켓',
    HeavyJacket: '두꺼운 자켓',
    Vest: '조끼',
    Shorts: '반바지',
    Tights: '타이츠',
    Pants: '긴바지',
    Gloves: '장갑',
    'Gloves or Mittens': '장갑 또는 벙어리장갑',
    Sunscreen: '자외선 차단제',
  };

  return map[item] || item;
};

export const getClothingIconPath = (item: string): string => {
  const fileNames: Record<string, string> = {
    Cap: 'cap',
    Beanie: 'beanie',
    Sunglasses: 'sunglasses',
    Singlet: 'singlet',
    TShirt: 'tshirt',
    LongSleeveShirt: 'longsleeve',
    Jacket: 'jacket',
    HeavyJacket: 'heavyjacket',
    Vest: 'vest',
    Shorts: 'shorts',
    Tights: 'tights',
    Pants: 'pants',
    Gloves: 'gloves',
    'Gloves or Mittens': 'mittens',
    Sunscreen: 'sunscreen',
  };

  const fileName = fileNames[item] || 'default';
  return `/icons/clothing/${fileName}.svg`;
};

// 카카오 맵 SDK 로드 및 초기화 유틸리티
import type { Coordinate } from '../types/map';

export const DEFAULT_COORDS: Coordinate = { lat: 37.5665, lng: 126.9780 };

// 카카오 맵 SDK 로드
export const loadKakaoMapSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    // API 키 확인
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    if (!apiKey) {
      reject(new Error('카카오 맵 API 키가 설정되지 않았습니다.'));
      return;
    }

    // 이미 스크립트가 로드 중인지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      // 스크립트가 이미 있으면 로드 완료를 기다림
      const checkKakao = () => {
        if (window.kakao && window.kakao.maps) {
          resolve();
        } else {
          setTimeout(checkKakao, 100);
        }
      };
      checkKakao();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      try {
        window.kakao.maps.load(() => {
          resolve();
        });
      } catch (error) {
        reject(new Error('카카오 맵 SDK 초기화 실패'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('카카오 맵 SDK 로드 실패'));
    };
    
    document.head.appendChild(script);
  });
};



// 지도 생성
export const createMap = (coords: Coordinate): kakao.maps.Map => {
  const container = document.getElementById('map');
  if (!container) {
    throw new Error('지도를 표시할 컨테이너를 찾을 수 없습니다.');
  }

  const options: kakao.maps.MapOptions = {
    center: new kakao.maps.LatLng(coords.lat, coords.lng),
    level: 4,
    currentLocationMarker: false  // 현재 위치 마커 비활성화
  };
  
  const mapInstance = new window.kakao.maps.Map(container, options);
  
  // 현재 위치 추적 모드 비활성화 (타입 안전성을 위해 any 사용)
  if ((mapInstance as any).setCurrentLocationTrackingMode) {
    (mapInstance as any).setCurrentLocationTrackingMode(0);
  }
  
  return mapInstance;
};

// 위치 권한 요청 및 실시간 위치 감시
export const initGeolocation = (
  map: kakao.maps.Map,
  onLocationUpdate: (position: kakao.maps.LatLng) => void,
  onLoadingChange: (loading: boolean) => void,
  onError: (error: GeolocationPositionError) => void
): (() => void) | undefined => {
  if (!navigator.geolocation) {
    alert('Geolocation API를 지원하지 않습니다.');
    onLoadingChange(false);
    return;
  }

  onLoadingChange(true);

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onLoadingChange(false);
      const { latitude, longitude } = position.coords;
      const userLatLng = new kakao.maps.LatLng(latitude, longitude);
      
      // 지도 중심 이동
      map.setCenter(userLatLng);
      
      // 콜백으로 위치 전달
      onLocationUpdate(userLatLng);
    },
    (error) => {
      onLoadingChange(false);
      onError(error);
    },
    { 
      enableHighAccuracy: true, 
      maximumAge: 10000, 
      timeout: 10000 
    }
  );

  // cleanup 함수 반환
  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}; 

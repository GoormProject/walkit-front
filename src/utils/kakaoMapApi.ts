// 카카오 맵 SDK 로드 및 초기화 유틸리티

interface Coords {
  lat: number;
  lng: number;
}

export const DEFAULT_COORDS: Coords = { lat: 37.5665, lng: 126.9780 };

// 카카오 맵 SDK 로드
export const loadKakaoMapSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    script.onerror = () => {
      reject(new Error('카카오 맵 SDK 로드 실패'));
    };
    document.head.appendChild(script);
  });
};



// 지도 생성
export const createMap = (coords: Coords): kakao.maps.Map => {
  const container = document.getElementById('map');
  if (!container) {
    throw new Error('지도를 표시할 컨테이너를 찾을 수 없습니다.');
  }

  const options: kakao.maps.MapOptions = {
    center: new kakao.maps.LatLng(coords.lat, coords.lng),
    level: 4,
  };
  
  const mapInstance = new window.kakao.maps.Map(container, options);
  
  return mapInstance;
};

// 위치 권한 요청 및 실시간 위치 감시
export const initGeolocation = (
  map: kakao.maps.Map,
  onLocationUpdate: (marker: kakao.maps.Marker) => void,
  onLoadingChange: (loading: boolean) => void,
  onError: (error: GeolocationPositionError) => void
): void => {
  if (!navigator.geolocation) {
    alert('Geolocation API를 지원하지 않습니다.');
    onLoadingChange(false);
    return;
  }

  onLoadingChange(true);

  navigator.geolocation.watchPosition(
    (position) => {
      onLoadingChange(false);
      const { latitude, longitude } = position.coords;
      const userLatLng = new kakao.maps.LatLng(latitude, longitude);
      
      // 지도 중심 이동
      map.setCenter(userLatLng);
      
      // 새로운 마커 생성
      const newUserMarker = new kakao.maps.Marker({ 
        map, 
        position: userLatLng 
      });
      
      // 콜백으로 마커 전달
      onLocationUpdate(newUserMarker);
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
}; 

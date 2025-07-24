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

// 로딩 스피너 표시/숨김
export const showLoading = (show: boolean): void => {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    loadingEl.style.display = show ? 'block' : 'none';
  }
};

// 지도 생성
export const createMap = (coords: Coords): kakao.maps.KakaoMap => {
  const container = document.getElementById('map');
  if (!container) {
    throw new Error('지도를 표시할 컨테이너를 찾을 수 없습니다.');
  }

  const options: kakao.maps.MapOptions = {
    center: new kakao.maps.LatLng(coords.lat, coords.lng),
    level: 4,
  };
  
  const mapInstance = new window.kakao.maps.KakaoMap(container, options);
  
  return mapInstance;
};

// 위치 권한 요청 및 실시간 위치 감시
export const initGeolocation = (
  map: kakao.maps.KakaoMap,
  userMarkerRef: React.MutableRefObject<kakao.maps.Marker | null>,
  setLoading: (loading: boolean) => void
): void => {
  if (!navigator.geolocation) {
    alert('Geolocation API를 지원하지 않습니다.');
    showLoading(false);
    return;
  }

  setLoading(true);

  navigator.geolocation.watchPosition(
    (position) => {
      setLoading(false);
      const { latitude, longitude } = position.coords;
      const userLatLng = new kakao.maps.LatLng(latitude, longitude);
      
      // 지도 중심 이동
      map.setCenter(userLatLng);
      
      // 기존 마커가 있으면 제거
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
      
      // 새로운 마커 생성
      const newUserMarker = new kakao.maps.Marker({ 
        map, 
        position: userLatLng 
      });
      userMarkerRef.current = newUserMarker;
    },
    (error) => {
      console.warn('위치 권한 또는 위치 수신 에러:', error);
      setLoading(false);
      
      // 에러 타입에 따른 사용자 안내
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert('위치 권한이 거부되었습니다. 기본 위치(서울 시청)로 표시됩니다.');
          break;
        case error.POSITION_UNAVAILABLE:
          alert('위치 정보를 사용할 수 없습니다. 기본 위치(서울 시청)로 표시됩니다.');
          break;
        case error.TIMEOUT:
          alert('위치 요청 시간이 초과되었습니다. 기본 위치(서울 시청)로 표시됩니다.');
          break;
        default:
          alert('위치 정보를 가져오는 중 오류가 발생했습니다. 기본 위치(서울 시청)로 표시됩니다.');
      }
    },
    { 
      enableHighAccuracy: true, 
      maximumAge: 10000, 
      timeout: 10000 
    }
  );
}; 

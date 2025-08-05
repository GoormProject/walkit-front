// 카카오 맵 SDK 로드 및 초기화 유틸리티
import type { Coordinate } from '../types/map';

export const DEFAULT_COORDS: Coordinate = { lat: 37.5665, lng: 126.9780 };

// API 키 유효성 검사
export const validateKakaoMapApiKey = (): { isValid: boolean; message: string } => {
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  
  if (!apiKey) {
    return { isValid: false, message: 'API 키가 설정되지 않았습니다.' };
  }
  
  if (apiKey.length !== 32) {
    return { isValid: false, message: `API 키 길이가 올바르지 않습니다. (현재: ${apiKey.length}자)` };
  }
  
  if (!/^[A-Za-z0-9]{32}$/.test(apiKey)) {
    return { isValid: false, message: 'API 키 형식이 올바르지 않습니다.' };
  }
  
  return { isValid: true, message: 'API 키 형식이 올바릅니다.' };
};

// 카카오 맵 SDK 로드
export const loadKakaoMapSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      console.log('카카오맵 SDK 이미 로드됨');
      resolve();
      return;
    }

    // API 키 검증
    const validation = validateKakaoMapApiKey();
    if (!validation.isValid) {
      reject(new Error(validation.message));
      return;
    }

    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    console.log('카카오맵 SDK 로드 시작:', apiKey.substring(0, 8) + '...');

    // 이미 스크립트가 로드 중인지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      console.log('카카오맵 스크립트 이미 존재, 로드 완료 대기');
      // 스크립트가 이미 있으면 로드 완료를 기다림
      const checkKakao = () => {
        if (window.kakao && window.kakao.maps) {
          console.log('카카오맵 SDK 로드 완료 (기존 스크립트)');
          resolve();
        } else {
          setTimeout(checkKakao, 100);
        }
      };
      checkKakao();
      return;
    }

    // 타임아웃 설정
    const timeout = setTimeout(() => {
      reject(new Error('카카오맵 SDK 로드 타임아웃 (10초)'));
    }, 10000);

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
    script.async = true;
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log('카카오맵 스크립트 로드 완료');
      try {
        window.kakao.maps.load(() => {
          console.log('카카오맵 SDK 초기화 완료');
          resolve();
        });
      } catch (error) {
        console.error('카카오맵 SDK 초기화 실패:', error);
        reject(new Error('카카오 맵 SDK 초기화 실패'));
      }
    };
    
    script.onerror = (error) => {
      clearTimeout(timeout);
      console.error('카카오맵 스크립트 로드 실패:', error);
      reject(new Error('카카오 맵 SDK 로드 실패 - API 키 또는 도메인 설정 확인 필요'));
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
  console.log('🌍 initGeolocation 시작');
  console.log('🌐 프로토콜:', window.location.protocol);
  
  if (!navigator.geolocation) {
    console.error('❌ Geolocation API를 지원하지 않습니다.');
    alert('Geolocation API를 지원하지 않습니다.');
    onLoadingChange(false);
    return;
  }

  console.log('✅ Geolocation API 지원 확인됨');
  onLoadingChange(true);

  // 위치 권한 상태 확인
  if ('permissions' in navigator) {
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      console.log('🔐 위치 권한 상태:', permissionStatus.state);
      
      if (permissionStatus.state === 'denied') {
        console.warn('⚠️ 위치 권한이 거부되었습니다.');
        onLoadingChange(false);
        onError({
          code: 1, // PERMISSION_DENIED
          message: '위치 권한이 거부되었습니다.',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3
        });
        return;
      }
      
      permissionStatus.onchange = () => {
        console.log('🔐 위치 권한 상태 변경:', permissionStatus.state);
      };
    }).catch((error) => {
      console.warn('⚠️ 권한 상태 확인 실패:', error);
    });
  }

  // 먼저 한 번 위치를 가져와서 권한 확인
  const getCurrentPosition = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        { 
          enableHighAccuracy: true, 
          maximumAge: 30000, 
          timeout: 10000 
        }
      );
    });
  };

  // 초기 위치 가져오기
  getCurrentPosition()
    .then((position) => {
      console.log('✅ 초기 위치 정보 수신:', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toLocaleString()
      });
      
      const { latitude, longitude } = position.coords;
      const userLatLng = new kakao.maps.LatLng(latitude, longitude);
      
      // 지도 중심 이동
      map.setCenter(userLatLng);
      
      // 콜백으로 위치 전달
      onLocationUpdate(userLatLng);
      onLoadingChange(false);
    })
    .catch((error) => {
      console.error('❌ 초기 위치 정보 수신 실패:', {
        code: error.code,
        message: error.message
      });
      
      onLoadingChange(false);
      onError(error);
    });

  // 실시간 위치 감시 시작
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      console.log('✅ 실시간 위치 정보 수신:', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toLocaleString()
      });
      
      const { latitude, longitude } = position.coords;
      const userLatLng = new kakao.maps.LatLng(latitude, longitude);
      
      // 콜백으로 위치 전달
      onLocationUpdate(userLatLng);
      // 실시간 감시에서는 로딩 상태를 false로 유지
      onLoadingChange(false);
    },
    (error) => {
      console.error('❌ 실시간 위치 정보 수신 실패:', {
        code: error.code,
        message: error.message
      });
      
      onLoadingChange(false);
      onError(error);
    },
    { 
      enableHighAccuracy: true, 
      maximumAge: 10000, 
      timeout: 10000 
    }
  );

  console.log('👀 위치 감시 시작됨 (watchId:', watchId, ')');

  // cleanup 함수 반환
  return () => {
    console.log('🧹 위치 감시 정리 (watchId:', watchId, ')');
    navigator.geolocation.clearWatch(watchId);
    onLoadingChange(false);
  };
}; 

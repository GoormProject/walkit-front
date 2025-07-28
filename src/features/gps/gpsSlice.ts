import { create } from 'zustand';

interface GPSState {
  error: GeolocationPositionError | null;
  accuracy: number | null;
  isLoading: boolean;
  position: kakao.maps.LatLng | null;
  actions: {
    setError: (error: GeolocationPositionError | null) => void;
    setAccuracy: (accuracy: number | null) => void;
    setLoading: (isLoading: boolean) => void;
    setPosition: (position: kakao.maps.LatLng | null) => void;
  };
}

export const useGPSStore = create<GPSState>()((set) => ({
  error: null,
  accuracy: null,
  isLoading: false,
  position: null,
  actions: {
    setError: (error) => set({ error, isLoading: false }), // 에러 발생 시 로딩 상태도 false로 설정
    setAccuracy: (accuracy) => set({ accuracy }),
    setLoading: (isLoading) => set({ isLoading }),
    setPosition: (position) => set({ position, isLoading: false }), // 위치 설정 시 로딩 상태도 false로 설정
  },
})); 

import { create } from 'zustand';

export enum GPSErrorCode {
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
}

interface GPSState {
  error: GeolocationPositionError | null;
  accuracy: number | null;
  isLoading: boolean;
  actions: {
    setError: (error: GeolocationPositionError | null) => void;
    setAccuracy: (accuracy: number | null) => void;
    setLoading: (isLoading: boolean) => void;
  };
}

export const useGPSStore = create<GPSState>()((set) => ({
  error: null,
  accuracy: null,
  isLoading: false,
  actions: {
    setError: (error) => set({ error }),
    setAccuracy: (accuracy) => set({ accuracy }),
    setLoading: (isLoading) => set({ isLoading }),
  },
})); 

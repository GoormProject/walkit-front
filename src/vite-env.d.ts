/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_PORT: string
  readonly VITE_HOST: string
  readonly VITE_SOURCEMAP: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 카카오 맵 SDK 타입 정의
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: kakao.maps.MapOptions) => kakao.maps.Map;
        LatLng: new (lat: number, lng: number) => kakao.maps.LatLng;
        Marker: new (options: kakao.maps.MarkerOptions) => kakao.maps.Marker;
        MapOptions: {
          center: kakao.maps.LatLng;
          level: number;
        };
        MarkerOptions: {
          map: kakao.maps.Map;
          position: kakao.maps.LatLng;
        };
      };
    };
  }
  
  namespace kakao {
    namespace maps {
      class Map {
        constructor(container: HTMLElement, options: MapOptions);
        setCenter(latLng: LatLng): void;
      }
      
      class LatLng {
        constructor(lat: number, lng: number);
        getLat(): number;
        getLng(): number;
      }
      
      class Marker {
        constructor(options: MarkerOptions);
        setPosition(latLng: LatLng): void;
        setMap(map: Map | null): void;
      }
      
      interface MapOptions {
        center: LatLng;
        level: number;
      }
      
      interface MarkerOptions {
        map: Map;
        position: LatLng;
      }
    }
  }
}

export {};

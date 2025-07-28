// 공통 좌표 타입 정의
export interface Coordinate {
  lat: number;
  lng: number;
}

declare global {
  namespace kakao.maps {
    // 기존 MapOptions 확장 (재정의하지 않음)
    interface MapOptions {
      currentLocationMarker?: boolean;
    }

    // 기존 Map 클래스에 메서드 추가 (interface로 확장)
    interface Map {
      getLevel(): number;
      addListener(eventName: string, handler: Function): void;
      removeListener(eventName: string, handler: Function): void;
      setBounds(bounds: LatLngBounds): void;
    }

    // 새로운 타입들만 정의
    interface CircleOptions {
      center: LatLng;
      radius: number;
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeStyle?: string;
      fillColor?: string;
      fillOpacity?: number;
      map?: Map;
    }

    class Circle {
      constructor(options: CircleOptions);
      setMap(map: Map | null): void;
      setCenter(position: LatLng): void;
      setRadius(radius: number): void;
    }

    class LatLngBounds {
      constructor();
      extend(latLng: LatLng): void;
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
    }

    interface CustomOverlayOptions {
      content: HTMLElement;
      map?: Map;
      position: LatLng;
      xAnchor?: number;
      yAnchor?: number;
      zIndex?: number;
    }

    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
      setPosition(position: LatLng): void;
      setContent(content: HTMLElement): void;
      setVisible(visible: boolean): void;
      setZIndex(zIndex: number): void;
    }
  }
} 

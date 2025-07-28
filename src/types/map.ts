declare global {
  namespace kakao.maps {
    interface MapOptions {
      center: LatLng;
      level?: number;
      currentLocationMarker?: boolean;
    }

    interface Map {
      getCenter(): LatLng;
      setCenter(latlng: LatLng): void;
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

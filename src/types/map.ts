declare global {
  namespace kakao.maps {
    interface MapOptions {
      center: LatLng;
      level?: number;
    }

    interface LocationMarker {
      setMap(map: Map | null): void;
    }

    interface Map {
      getCenter(): LatLng;
      setCenter(latlng: LatLng): void;
      getLocationMarker?(): LocationMarker | null;
      setCurrentLocationTrackingMode?(mode: number): void;
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

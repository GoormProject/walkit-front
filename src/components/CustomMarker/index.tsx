import React, { useEffect, useRef } from 'react';
import { Navigation } from 'lucide-react';
import './styles.css';

interface CustomMarkerProps {
  map: kakao.maps.Map;
  position: kakao.maps.LatLng;
  heading?: number; // 방향 (도 단위, 0-360)
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  map,
  position,
  heading = 0
}) => {
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 커스텀 오버레이 생성
    overlayRef.current = new kakao.maps.CustomOverlay({
      position,
      content: containerRef.current,
      map,
      yAnchor: 0.5,
      xAnchor: 0.5,
      zIndex: 3
    });

    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
    };
  }, [map]);

  // 위치 업데이트
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setPosition(position);
    }
  }, [position]);

  return (
    <div ref={containerRef} className="custom-marker">
      <div 
        className="icon-wrapper"
        style={{ transform: `rotate(${heading}deg)` }}
      >
        <Navigation />
      </div>
    </div>
  );
}; 

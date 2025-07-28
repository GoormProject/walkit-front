import React, { useEffect, useRef } from 'react';
import { Navigation } from 'lucide-react';
import './styles.css';

interface CustomMarkerProps {
  map: kakao.maps.Map;
  position: kakao.maps.LatLng;
  heading?: number; // 방향 (도 단위, 0-360)
  accuracy?: number; // GPS 정확도 (미터)
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  map,
  position,
  heading = 0,
  accuracy
}) => {
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const accuracyCircleRef = useRef<kakao.maps.Circle | null>(null);

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

    // 정확도 표시 원 생성
    if (accuracy) {
      accuracyCircleRef.current = new kakao.maps.Circle({
        center: position,
        radius: accuracy,
        strokeWeight: 1,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.3,
        strokeStyle: 'solid',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        map
      });
    }

    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setMap(null);
      }
    };
  }, [map]);

  // 위치 업데이트
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setPosition(position);
    }
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setCenter(position);
      if (accuracy) {
        accuracyCircleRef.current.setRadius(accuracy);
      }
    }
  }, [position, accuracy]);

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

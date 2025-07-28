import React, { useEffect, useRef } from 'react';
import { Navigation } from 'lucide-react';
import './styles.css';

// 기본 크기와 스케일 팩터 설정
const BASE_MARKER_SIZE = 24;
const BASE_ICON_SIZE = 16;
const SCALE_FACTOR = 1.1;

// 줌 레벨별 마커 크기 계산
const MARKER_SIZES: Record<number, [number, number]> = Array.from({ length: 9 }, (_, index) => {
  const level = index + 1;
  const scale = Math.pow(SCALE_FACTOR, level - 1);
  const markerSize = Math.round(BASE_MARKER_SIZE * scale);
  const iconSize = Math.round(BASE_ICON_SIZE * scale);
  return [level, [markerSize, iconSize]] as [number, [number, number]];
}).reduce((acc, [level, sizes]) => ({
  ...acc,
  [level.toString()]: sizes
}), {} as Record<number, [number, number]>);

// 줌 레벨에 따른 크기 계산
const getMarkerSize = (level: number): [number, number] => {
  // 범위를 1-9로 제한
  const normalizedLevel = Math.max(1, Math.min(9, level));
  return MARKER_SIZES[normalizedLevel] || MARKER_SIZES[1];
};

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
  const accuracyCircleRef = useRef<kakao.maps.Circle | null>(null);
  const markerElementRef = useRef<HTMLDivElement | null>(null);

  // 마커 엘리먼트 생성
  const createMarkerElement = () => {
    const [markerWidth, iconSize] = getMarkerSize(map.getLevel());

    const container = document.createElement('div');
    container.className = 'custom-marker';
    container.style.width = `${markerWidth}px`;
    container.style.height = `${markerWidth}px`;

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';
    iconWrapper.style.transform = `rotate(${heading}deg)`;
    iconWrapper.style.width = `${iconSize}px`;
    iconWrapper.style.height = `${iconSize}px`;

    // SVG 아이콘 생성 (Navigation 아이콘)
    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('width', `${iconSize}`);
    svgIcon.setAttribute('height', `${iconSize}`);
    svgIcon.setAttribute('viewBox', '0 0 24 24');
    svgIcon.setAttribute('fill', 'none');
    svgIcon.setAttribute('stroke', 'currentColor');
    svgIcon.setAttribute('stroke-width', '2');
    svgIcon.setAttribute('stroke-linecap', 'round');
    svgIcon.setAttribute('stroke-linejoin', 'round');

    // Navigation 아이콘의 실제 경로
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M3 11l19-9-9 19-2-8-8-2z');

    svgIcon.appendChild(path);
    iconWrapper.appendChild(svgIcon);
    container.appendChild(iconWrapper);

    return container;
  };

  // 줌 레벨 변경 감지
  useEffect(() => {
    const handleZoomChanged = () => {
      if (overlayRef.current && markerElementRef.current) {
        const newMarkerElement = createMarkerElement();
        overlayRef.current.setContent(newMarkerElement);
        markerElementRef.current = newMarkerElement;
      }
    };

    map.addListener('zoom_changed', handleZoomChanged);

    return () => {
      map.removeListener('zoom_changed', handleZoomChanged);
    };
  }, [map, heading]);

  // 마커 초기화 및 정리
  useEffect(() => {
    // 기존 객체들 정리
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
    }
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setMap(null);
    }

    // 새 마커 엘리먼트 생성
    const markerElement = createMarkerElement();
    markerElementRef.current = markerElement;

    // 새 오버레이 생성
    overlayRef.current = new kakao.maps.CustomOverlay({
      position,
      content: markerElement,
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
  }, [map, position, heading, accuracy]);

  // 컴포넌트는 실제 DOM을 렌더링하지 않음
  return null;
}; 

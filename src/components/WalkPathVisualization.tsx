import React, { useEffect, useRef } from 'react';

interface WalkPathVisualizationProps {
  map: kakao.maps.Map;
  path: number[][];
  isActive: boolean;
}

export const WalkPathVisualization: React.FC<WalkPathVisualizationProps> = ({
  map,
  path,
  isActive,
}) => {
  const polylineRef = useRef<kakao.maps.Polyline | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);

  useEffect(() => {
    // 기존 경로와 마커 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 경로가 2개 이상의 포인트가 있을 때만 그리기
    if (path.length < 2) return;

    // 경로 좌표를 카카오맵 LatLng로 변환
    const pathPoints = path.map(point => 
      new kakao.maps.LatLng(point[1], point[0])
    );

    // 폴리라인 생성
    const polyline = new kakao.maps.Polyline({
      path: pathPoints,
      strokeWeight: 5,
      strokeColor: isActive ? '#FF6B6B' : '#4ECDC4',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      map: map,
    });

    polylineRef.current = polyline;

    // 시작점과 끝점에 마커 추가
    if (path.length > 0) {
      // 시작점 마커
      const startMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(path[0][1], path[0][0]),
        map: map,
      });

      // 시작점 마커에 커스텀 오버레이 추가
      const startDiv = document.createElement('div');
      startDiv.style.background = '#4CAF50';
      startDiv.style.color = 'white';
      startDiv.style.padding = '4px 8px';
      startDiv.style.borderRadius = '12px';
      startDiv.style.fontSize = '12px';
      startDiv.style.fontWeight = 'bold';
      startDiv.textContent = '시작';

      const startOverlay = new kakao.maps.CustomOverlay({
        content: startDiv,
        position: new kakao.maps.LatLng(path[0][1], path[0][0]),
        xAnchor: 0.5,
        yAnchor: 1.5,
      });
      startOverlay.setMap(map);

      markersRef.current.push(startMarker);

      // 끝점 마커 (경로가 2개 이상일 때)
      if (path.length > 1) {
        const endMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(path[path.length - 1][1], path[path.length - 1][0]),
          map: map,
        });

        // 끝점 마커에 커스텀 오버레이 추가
        const endDiv = document.createElement('div');
        endDiv.style.background = '#FF5722';
        endDiv.style.color = 'white';
        endDiv.style.padding = '4px 8px';
        endDiv.style.borderRadius = '12px';
        endDiv.style.fontSize = '12px';
        endDiv.style.fontWeight = 'bold';
        endDiv.textContent = '현재';

        const endOverlay = new kakao.maps.CustomOverlay({
          content: endDiv,
          position: new kakao.maps.LatLng(path[path.length - 1][1], path[path.length - 1][0]),
          xAnchor: 0.5,
          yAnchor: 1.5,
        });
        endOverlay.setMap(map);

        markersRef.current.push(endMarker);
      }
    }

    // 경로가 지도에 맞도록 자동 조정
    if (pathPoints.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      pathPoints.forEach(point => bounds.extend(point));
      map.setBounds(bounds);
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [map, path, isActive]);

  return null;
}; 

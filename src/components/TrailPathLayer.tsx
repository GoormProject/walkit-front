import React, { useEffect, useRef, useCallback } from 'react';
import type { TrailPathData } from '../types/trail';

interface TrailPathLayerProps {
  map: kakao.maps.Map;
  paths: TrailPathData[];
  selectedTrailId?: string;
  onTrailClick?: (trailId: string) => void;
  onTrailHover?: (trailId: string | null) => void;
}

const TrailPathLayer: React.FC<TrailPathLayerProps> = ({
  map,
  paths,
  selectedTrailId,
  onTrailClick,
  onTrailHover
}) => {
  const polylinesRef = useRef<Map<string, kakao.maps.Polyline>>(new Map());

  // 폴리라인 생성
  const createPolyline = useCallback((path: TrailPathData, isSelected: boolean): kakao.maps.Polyline => {
    const polyline = new window.kakao.maps.Polyline({
      map,
      path: path.coordinates,
      strokeWeight: path.style.strokeWeight,
      strokeColor: path.style.strokeColor,
      strokeOpacity: path.style.strokeOpacity,
      strokeStyle: path.style.strokeStyle,
      zIndex: isSelected ? 2 : 1
    });

    // 클릭 이벤트 핸들러 추가
    if (onTrailClick) {
      // 카카오맵 API 이벤트 리스너 추가 (타입 안전성을 위해 any 사용)
      (window.kakao.maps as any).event?.addListener(polyline, 'click', () => {
        onTrailClick(path.id);
      });
    }

    // 호버 이벤트 핸들러 추가
    if (onTrailHover) {
      (window.kakao.maps as any).event?.addListener(polyline, 'mouseover', () => {
        onTrailHover(path.id);
        // 호버 시 시각적 피드백 (투명도 증가)
        (polyline as any).setStrokeOpacity?.(Math.min(path.style.strokeOpacity + 0.2, 1.0));
      });

      (window.kakao.maps as any).event?.addListener(polyline, 'mouseout', () => {
        onTrailHover(null);
        // 원래 투명도로 복원
        (polyline as any).setStrokeOpacity?.(path.style.strokeOpacity);
      });
    }

    return polyline;
  }, [map, onTrailClick, onTrailHover]);



  // 경로 렌더링 (메모리 누수 방지)
  useEffect(() => {
    const currentPolylines = new Map<string, kakao.maps.Polyline>();
    
    // 새로운 경로들 렌더링
    paths.forEach(path => {
      const isSelected = selectedTrailId === path.id;
      const polyline = createPolyline(path, isSelected);
      currentPolylines.set(path.id, polyline);
    });

    // 기존 폴리라인 중 더 이상 필요하지 않은 것들 제거
    polylinesRef.current.forEach((polyline, pathId) => {
      if (!currentPolylines.has(pathId)) {
        polyline.setMap(null);
      }
    });

    // 새로운 폴리라인으로 교체
    polylinesRef.current = currentPolylines;

    // 컴포넌트 언마운트 시 정리
    return () => {
      polylinesRef.current.forEach(polyline => {
        polyline.setMap(null);
      });
      polylinesRef.current.clear();
    };
  }, [paths, createPolyline]);

  // 선택된 경로 하이라이트 (간단한 버전)
  useEffect(() => {
    // 선택된 경로가 변경되면 모든 폴리라인을 다시 렌더링
    polylinesRef.current.forEach(polyline => {
      polyline.setMap(null);
    });
    polylinesRef.current.clear();

    paths.forEach(path => {
      const isSelected = selectedTrailId === path.id;
      const polyline = createPolyline(path, isSelected);
      polylinesRef.current.set(path.id, polyline);
    });
  }, [selectedTrailId, paths, createPolyline]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않고 카카오맵에 직접 그립니다
};

export default TrailPathLayer; 

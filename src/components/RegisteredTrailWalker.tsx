import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { RegisteredTrail } from '../utils/mockTrailApi';
import { calculateTrailProgress, isNearTrail, getProgressColor, progressToPercentage, formatDistance } from '../utils/trailProgressUtils';

interface RegisteredTrailWalkerProps {
  map: kakao.maps.Map;
  trail: RegisteredTrail;
  currentPosition: { latitude: number; longitude: number } | null;
  isWalking: boolean;
  onProgressUpdate?: (progress: number) => void;
}

const RegisteredTrailWalker: React.FC<RegisteredTrailWalkerProps> = ({
  map,
  trail,
  currentPosition,
  isWalking,
  onProgressUpdate
}) => {
  const [progress, setProgress] = useState(0);
  const [isNearTrailPath, setIsNearTrailPath] = useState(false);
  const [completedDistance, setCompletedDistance] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  
  const completedPolylineRef = useRef<kakao.maps.Polyline | null>(null);
  const remainingPolylineRef = useRef<kakao.maps.Polyline | null>(null);
  const progressMarkerRef = useRef<kakao.maps.Marker | null>(null);

  // 경로를 카카오맵 LatLng 배열로 변환
  const pathLatLngs = trail.path.map(point => 
    new kakao.maps.LatLng(point.latitude, point.longitude)
  );

  // 폴리라인 생성 함수
  const createPolyline = useCallback((
    path: kakao.maps.LatLng[], 
    color: string, 
    opacity: number = 0.8
  ): kakao.maps.Polyline => {
    return new window.kakao.maps.Polyline({
      map,
      path,
      strokeWeight: 4,
      strokeColor: color,
      strokeOpacity: opacity,
      strokeStyle: 'solid',
      zIndex: 1
    });
  }, [map]);

  // 마커 생성 함수
  const createMarker = useCallback((position: kakao.maps.LatLng): kakao.maps.Marker => {
    return new window.kakao.maps.Marker({
      map,
      position
    });
  }, [map]);

  // 기존 폴리라인과 마커 제거
  const clearVisualization = useCallback(() => {
    if (completedPolylineRef.current) {
      completedPolylineRef.current.setMap(null);
      completedPolylineRef.current = null;
    }
    if (remainingPolylineRef.current) {
      remainingPolylineRef.current.setMap(null);
      remainingPolylineRef.current = null;
    }
    if (progressMarkerRef.current) {
      progressMarkerRef.current.setMap(null);
      progressMarkerRef.current = null;
    }
  }, []);

  // 진행률에 따른 시각화 업데이트
  const updateVisualization = useCallback((trailProgress: number) => {
    clearVisualization();

    if (trailProgress > 0) {
      // 완료된 부분 (회색)
      const completedIndex = Math.floor(pathLatLngs.length * trailProgress);
      const completedPath = pathLatLngs.slice(0, completedIndex + 1);
      
      if (completedPath.length > 1) {
        completedPolylineRef.current = createPolyline(completedPath, '#9E9E9E', 0.6);
      }

      // 남은 부분 (원래 색상)
      const remainingPath = pathLatLngs.slice(completedIndex);
      if (remainingPath.length > 1) {
        remainingPolylineRef.current = createPolyline(remainingPath, '#2196F3', 0.8);
      }

      // 현재 위치 마커
      if (currentPosition) {
        const currentLatLng = new kakao.maps.LatLng(currentPosition.latitude, currentPosition.longitude);
        progressMarkerRef.current = createMarker(currentLatLng);
      }
    } else {
      // 진행률이 0인 경우 전체 경로를 원래 색상으로 표시
      remainingPolylineRef.current = createPolyline(pathLatLngs, '#2196F3', 0.8);
    }
  }, [pathLatLngs, currentPosition, createPolyline, createMarker, clearVisualization]);

  // 현재 위치와 진행률 업데이트
  useEffect(() => {
    if (!currentPosition || !isWalking) return;

    // 경로 근처에 있는지 확인
    const nearTrail = isNearTrail(currentPosition, trail.path);
    setIsNearTrailPath(nearTrail);

    if (nearTrail) {
      // 진행률 계산
      const trailProgress = calculateTrailProgress(currentPosition, trail.path);
      const newProgress = trailProgress.progress;
      
      setProgress(newProgress);
      setCompletedDistance(trailProgress.completedDistance);
      setTotalDistance(trailProgress.totalDistance);
      
      // 시각화 업데이트
      updateVisualization(newProgress);
      
      // 부모 컴포넌트에 진행률 알림
      onProgressUpdate?.(newProgress);
    }
  }, [currentPosition, isWalking, trail.path, updateVisualization, onProgressUpdate]);

  // 컴포넌트 마운트 시 초기 시각화
  useEffect(() => {
    if (isWalking) {
      updateVisualization(progress);
    } else {
      // 걷지 않을 때는 전체 경로를 표시
      clearVisualization();
      remainingPolylineRef.current = createPolyline(pathLatLngs, '#2196F3', 0.8);
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      clearVisualization();
    };
  }, [isWalking, progress, pathLatLngs, updateVisualization, clearVisualization, createPolyline]);

  // 진행률 표시 UI
  const renderProgressUI = () => {
    if (!isWalking || !isNearTrailPath) return null;

    return (
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10 max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{trail.title}</h3>
          <span className="text-sm text-gray-600">{progressToPercentage(progress)}%</span>
        </div>
        
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progressToPercentage(progress)}%`,
                backgroundColor: getProgressColor(progress)
              }}
            />
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>완료: {formatDistance(completedDistance)}</span>
          <span>전체: {formatDistance(totalDistance)}</span>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          {trail.location} • {formatDistance(trail.length)}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderProgressUI()}
    </>
  );
};

export default RegisteredTrailWalker; 

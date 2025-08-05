import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { TrailPathData, TrailProgress, EasingFunction } from '../types/trail';
import { 
  calculateProgress, 
  splitPathByDistance, 
  easingFunctions 
} from '../utils/trailProgressUtils';

interface AnimatedTrailPathProps {
  path: TrailPathData;
  map: kakao.maps.Map;
  isVisible: boolean;
  delay?: number;
  duration?: number;
  onAnimationComplete?: () => void;
  // 진행률 추적 관련 props
  currentPosition?: kakao.maps.LatLng;
  showProgress?: boolean;
  easingType?: EasingFunction;
  onProgressChange?: (progress: TrailProgress) => void;
}

const AnimatedTrailPath: React.FC<AnimatedTrailPathProps> = ({
  path,
  map,
  isVisible,
  delay = 0,
  duration = 1000,
  onAnimationComplete,
  currentPosition,
  showProgress = false,
  easingType = 'easeOut',
  onProgressChange,
}) => {
  const polylineRef = useRef<kakao.maps.Polyline | null>(null);
  const completedPolylineRef = useRef<kakao.maps.Polyline | null>(null);
  const remainingPolylineRef = useRef<kakao.maps.Polyline | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<TrailProgress | null>(null);

  // 컴포넌트 마운트/언마운트 추적
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 폴리라인 정리 함수
  const cleanupPolylines = useCallback(() => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (completedPolylineRef.current) {
      completedPolylineRef.current.setMap(null);
      completedPolylineRef.current = null;
    }
    if (remainingPolylineRef.current) {
      remainingPolylineRef.current.setMap(null);
      remainingPolylineRef.current = null;
    }
  }, []);

  // 애니메이션 정리 함수
  const cleanupAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // 진행률 업데이트 함수
  const updateProgress = useCallback(() => {
    if (!currentPosition || !showProgress) return;

    try {
      const progress = calculateProgress(currentPosition, path.coordinates);
      setCurrentProgress(progress);
      onProgressChange?.(progress);

      // 경로 분할
      const { completed, remaining } = splitPathByDistance(
        path.coordinates,
        progress.completedDistance,
        progress.totalDistance
      );

      // 완료된 구간 폴리라인 업데이트
      if (completedPolylineRef.current && completed.length > 0) {
        completedPolylineRef.current.setPath(completed);
        completedPolylineRef.current.setOptions({
          strokeWeight: path.style.strokeWeight + 1, // 더 굵게
          strokeStyle: 'solid',
          strokeColor: path.style.strokeColor,
          strokeOpacity: path.style.strokeOpacity
        });
      }

      // 남은 구간 폴리라인 업데이트
      if (remainingPolylineRef.current && remaining.length > 0) {
        remainingPolylineRef.current.setPath(remaining);
        remainingPolylineRef.current.setOptions({
          strokeWeight: Math.max(1, path.style.strokeWeight - 1), // 더 얇게
          strokeStyle: 'dashed',
          strokeColor: path.style.strokeColor,
          strokeOpacity: path.style.strokeOpacity * 0.6 // 더 투명하게
        });
      }
    } catch (error) {
      console.error('진행률 계산 오류:', error);
    }
  }, [currentPosition, showProgress, path, onProgressChange]);

  // 애니메이션 시작
  const startAnimation = useCallback(() => {
    if (!polylineRef.current || !isVisible || !isMountedRef.current) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const totalPoints = path.coordinates.length;

    const animate = () => {
      if (!polylineRef.current || !isVisible || !isMountedRef.current) {
        setIsAnimating(false);
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 선택된 이징 함수 적용
      const easeProgress = easingFunctions[easingType](progress);

      const currentPointCount = Math.floor(easeProgress * totalPoints);
      const currentCoordinates = path.coordinates.slice(0, currentPointCount);

      if (currentCoordinates.length > 0) {
        polylineRef.current?.setPath(currentCoordinates);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        if (isMountedRef.current) {
          onAnimationComplete?.();
        }
      }
    };

    // 지연 후 애니메이션 시작
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && polylineRef.current && isVisible) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }, delay);
  }, [path, map, isVisible, duration, delay, onAnimationComplete]);

  // 폴리라인 생성 및 가시성 관리
  useEffect(() => {
    if (isVisible) {
      // 진행률 추적 모드인 경우 분할된 폴리라인 생성
      if (showProgress && currentPosition) {
        // 기존 단일 폴리라인 제거
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }

        // 완료된 구간 폴리라인 생성
        if (!completedPolylineRef.current) {
          completedPolylineRef.current = new window.kakao.maps.Polyline({
            map,
            path: [],
            strokeWeight: path.style.strokeWeight + 1,
            strokeColor: path.style.strokeColor,
            strokeOpacity: path.style.strokeOpacity,
            strokeStyle: 'solid',
            zIndex: 2,
          });
        }

        // 남은 구간 폴리라인 생성
        if (!remainingPolylineRef.current) {
          remainingPolylineRef.current = new window.kakao.maps.Polyline({
            map,
            path: [],
            strokeWeight: Math.max(1, path.style.strokeWeight - 1),
            strokeColor: path.style.strokeColor,
            strokeOpacity: path.style.strokeOpacity * 0.6,
            strokeStyle: 'dashed',
            zIndex: 1,
          });
        }

        // 진행률 업데이트
        updateProgress();
      } else {
        // 기존 단일 폴리라인 모드
        if (!polylineRef.current) {
          polylineRef.current = new window.kakao.maps.Polyline({
            map,
            path: [],
            strokeWeight: path.style.strokeWeight,
            strokeColor: path.style.strokeColor,
            strokeOpacity: path.style.strokeOpacity,
            strokeStyle: path.style.strokeStyle,
            zIndex: 1,
          });

          // 애니메이션 시작
          if (isMountedRef.current) {
            startAnimation();
          }
        }
      }
    } else {
      // 모든 폴리라인 제거
      cleanupPolylines();
      setIsAnimating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, map, JSON.stringify(path.style), showProgress, currentPosition]);

  // 진행률 업데이트 효과
  useEffect(() => {
    if (showProgress && currentPosition && isVisible) {
      updateProgress();
    }
  }, [currentPosition, showProgress, isVisible, updateProgress]);

  // 컴포넌트 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      cleanupAnimation();
      cleanupPolylines();
    };
  }, [cleanupAnimation, cleanupPolylines]);

  return null;
};

export default AnimatedTrailPath;

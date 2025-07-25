import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { TrailPathData } from '../types/trail';

interface AnimatedTrailPathProps {
  path: TrailPathData;
  map: kakao.maps.Map;
  isVisible: boolean;
  delay?: number;
  duration?: number;
  onAnimationComplete?: () => void;
}

const AnimatedTrailPath: React.FC<AnimatedTrailPathProps> = ({
  path,
  map,
  isVisible,
  delay = 0,
  duration = 1000,
  onAnimationComplete
}) => {
  const polylineRef = useRef<kakao.maps.Polyline | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // 컴포넌트 마운트/언마운트 추적
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
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
      
      // 이징 함수 (부드러운 시작과 끝)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
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

  // 폴리라인 생성
  useEffect(() => {
    if (isVisible && !polylineRef.current) {
      polylineRef.current = new window.kakao.maps.Polyline({
        map,
        path: [],
        strokeWeight: path.style.strokeWeight,
        strokeColor: path.style.strokeColor,
        strokeOpacity: path.style.strokeOpacity,
        strokeStyle: path.style.strokeStyle,
        zIndex: 1
      });

      // startAnimation을 직접 호출하지 않고 조건부로 실행
      if (isMountedRef.current) {
        startAnimation();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, map, path.style.strokeWeight, path.style.strokeColor, path.style.strokeOpacity, path.style.strokeStyle]);

  // 컴포넌트 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      cleanupAnimation();
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [cleanupAnimation]);

  // 가시성 변경 시 애니메이션
  useEffect(() => {
    if (isVisible && polylineRef.current && !isAnimating) {
      startAnimation();
    } else if (!isVisible && polylineRef.current) {
      // 애니메이션 정리
      cleanupAnimation();
      // 즉시 제거 (API 제한으로 인해)
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
  }, [isVisible, isAnimating, startAnimation, cleanupAnimation]);

  return null;
};

export default AnimatedTrailPath; 

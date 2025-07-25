import { useState, useEffect, useCallback, useMemo } from 'react';
import type { GeoJSONFeatureCollection, TrailPathData } from '../types/trail';
import { getTrailPaths } from '@/utils/backendApi';
import { convertFeatureCollectionToTrailPathsSafe, convertFeatureCollectionToTrailPaths } from '@/utils/converter';

interface UseTrailPathsReturn {
  trailPaths: TrailPathData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface UseTrailPathsSafeReturn {
  trailPaths: (Omit<TrailPathData, 'coordinates'> & { coordinates: { lat: number; lng: number }[] })[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface TrailPathsStats {
  total: number;
  byCourseType: Record<string, number>;
  totalDistance: number;
  averageDistance: number;
}

/**
 * 경로 데이터로부터 통계를 계산하는 유틸리티 함수
 */
const calculateTrailStats = (trailPaths: TrailPathData[] | (Omit<TrailPathData, 'coordinates'> & { coordinates: { lat: number; lng: number }[] })[]): TrailPathsStats => {
  const total = trailPaths.length;
  
  const byCourseType = trailPaths.reduce((acc, path) => {
    acc[path.courseType] = (acc[path.courseType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalDistance = trailPaths.reduce((sum, path) => 
    sum + (path.properties.distance || 0), 0
  );
  
  const averageDistance = total > 0 ? totalDistance / total : 0;
  
  return {
    total,
    byCourseType,
    totalDistance,
    averageDistance,
  };
};

/**
 * 산책 경로 데이터를 관리하는 커스텀 훅 (카카오 맵 SDK 사용)
 */
export const useTrailPaths = (): UseTrailPathsReturn => {
  const [trailPaths, setTrailPaths] = useState<TrailPathData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrailPaths = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const geoJSONData: GeoJSONFeatureCollection = await getTrailPaths();
      const convertedPaths = convertFeatureCollectionToTrailPaths(geoJSONData);
      
      setTrailPaths(convertedPaths);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '경로 데이터를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('경로 데이터 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchTrailPaths();
  }, [fetchTrailPaths]);

  return {
    trailPaths,
    isLoading,
    error,
    refetch: fetchTrailPaths,
    clearError,
  };
};

/**
 * 산책 경로 데이터를 관리하는 커스텀 훅 (카카오 맵 SDK 없이 사용)
 */
export const useTrailPathsSafe = (): UseTrailPathsSafeReturn => {
  const [trailPaths, setTrailPaths] = useState<(Omit<TrailPathData, 'coordinates'> & { coordinates: { lat: number; lng: number }[] })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrailPaths = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const geoJSONData: GeoJSONFeatureCollection = await getTrailPaths();
      const convertedPaths = convertFeatureCollectionToTrailPathsSafe(geoJSONData);
      
      setTrailPaths(convertedPaths);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '경로 데이터를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('경로 데이터 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchTrailPaths();
  }, [fetchTrailPaths]);

  return {
    trailPaths,
    isLoading,
    error,
    refetch: fetchTrailPaths,
    clearError,
  };
};

/**
 * 특정 코스 타입의 경로만 필터링하는 커스텀 훅 (카카오 맵 SDK 사용)
 */
export const useTrailPathsByCourseType = (courseType: string): UseTrailPathsReturn => {
  const { trailPaths, isLoading, error, refetch, clearError } = useTrailPaths();
  
  const filteredPaths = trailPaths.filter(path => 
    path.courseType.toLowerCase() === courseType.toLowerCase()
  );

  return {
    trailPaths: filteredPaths,
    isLoading,
    error,
    refetch,
    clearError,
  };
};

/**
 * 특정 코스 타입의 경로만 필터링하는 커스텀 훅 (안전 버전)
 */
export const useTrailPathsByCourseTypeSafe = (courseType: string): UseTrailPathsSafeReturn => {
  const { trailPaths, isLoading, error, refetch, clearError } = useTrailPathsSafe();
  
  const filteredPaths = trailPaths.filter(path => 
    path.courseType.toLowerCase() === courseType.toLowerCase()
  );

  return {
    trailPaths: filteredPaths,
    isLoading,
    error,
    refetch,
    clearError,
  };
};

/**
 * 경로 데이터 통계를 제공하는 커스텀 훅 (카카오 맵 SDK 사용)
 */
export const useTrailPathsStats = (): TrailPathsStats => {
  const { trailPaths } = useTrailPaths();
  
  const stats = useMemo(() => calculateTrailStats(trailPaths), [trailPaths]);

  return stats;
};

/**
 * 경로 데이터 통계를 제공하는 커스텀 훅 (안전 버전)
 */
export const useTrailPathsStatsSafe = (): TrailPathsStats => {
  const { trailPaths } = useTrailPathsSafe();
  
  const stats = useMemo(() => calculateTrailStats(trailPaths), [trailPaths]);

  return stats;
}; 

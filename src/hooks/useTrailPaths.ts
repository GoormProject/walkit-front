import { useState, useEffect, useCallback } from 'react';
import type { GeoJSONFeatureCollection, TrailPathData } from '../types/trail';
import { getTrailPaths } from '../utils/api';
import { convertFeatureCollectionToTrailPathsSafe } from '../utils/trailConverter';

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
 * 특정 코스 타입의 경로만 필터링하는 커스텀 훅
 */
export const useTrailPathsByCourseType = (courseType: string) => {
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
 * 경로 데이터 통계를 제공하는 커스텀 훅
 */
export const useTrailPathsStats = () => {
  const { trailPaths } = useTrailPaths();
  
  const stats = {
    total: trailPaths.length,
    byCourseType: trailPaths.reduce((acc, path) => {
      acc[path.courseType] = (acc[path.courseType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalDistance: trailPaths.reduce((sum, path) => 
      sum + (path.properties.distance || 0), 0
    ),
    averageDistance: trailPaths.length > 0 
      ? trailPaths.reduce((sum, path) => sum + (path.properties.distance || 0), 0) / trailPaths.length
      : 0,
  };

  return stats;
}; 

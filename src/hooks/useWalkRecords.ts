import { useState, useEffect, useCallback } from 'react';
import type { WalkRecord, WalkCreateRequest } from '../types/walk';
import { getWalkList, getWalkDetail, createWalk } from '@/utils/walkApi';
import { convertWalkDetailToRecord, safeParseInt, validateAndSanitizeWalkRecord, isValidWalkRecord, isValidWalkDetail } from '@/utils/walkUtils';

interface UseWalkRecordsReturn {
  walkRecords: WalkRecord[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface UseWalkRecordDetailReturn {
  walkRecord: WalkRecord | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

/**
 * 산책 기록 목록을 관리하는 커스텀 훅
 */
export const useWalkRecords = (): UseWalkRecordsReturn => {
  const [walkRecords, setWalkRecords] = useState<WalkRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalkRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getWalkList();
      setWalkRecords(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '산책 기록을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('산책 기록 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchWalkRecords();
  }, [fetchWalkRecords]);

  return {
    walkRecords,
    isLoading,
    error,
    refetch: fetchWalkRecords,
    clearError,
  };
};

/**
 * 특정 산책 기록 상세 정보를 관리하는 커스텀 훅
 */
export const useWalkRecordDetail = (walkId: string): UseWalkRecordDetailReturn => {
  const [walkRecord, setWalkRecord] = useState<WalkRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalkRecordDetail = useCallback(async () => {
    if (!walkId) return;

    try {
      setIsLoading(true);
      setError(null);

      const walkIdNum = parseInt(walkId, 10);
      if (isNaN(walkIdNum)) {
        throw new Error('유효하지 않은 산책 기록 ID입니다.');
      }
              const response = await getWalkDetail(walkIdNum);
        
        // API 응답 데이터 유효성 검사
        if (!isValidWalkDetail(response.data)) {
          console.warn('API 응답 데이터 형식이 예상과 다릅니다:', response.data);
        }
        
        const walkRecordData = convertWalkDetailToRecord(response.data);
        const sanitizedWalkRecord = validateAndSanitizeWalkRecord(walkRecordData);
        setWalkRecord(sanitizedWalkRecord);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '산책 기록 상세 정보를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('산책 기록 상세 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [walkId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // walkId가 변경될 때마다 데이터 로드
  useEffect(() => {
    fetchWalkRecordDetail();
  }, [fetchWalkRecordDetail]);

  return {
    walkRecord,
    isLoading,
    error,
    refetch: fetchWalkRecordDetail,
    clearError,
  };
};

/**
 * 산책 기록 생성 훅
 */
export const useCreateWalkRecord = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecord = useCallback(async (walkData: WalkCreateRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createWalk(walkData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '산책 기록 생성에 실패했습니다.';
      setError(errorMessage);
      console.error('산책 기록 생성 실패:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createRecord,
    isLoading,
    error,
    clearError,
  };
};

/**
 * 산책 기록 통계 훅
 */
export const useWalkRecordsStats = () => {
  const [stats, setStats] = useState({
    totalWalks: 0,
    totalDistance: 0,
    totalTime: 0,
    averagePace: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getWalkList();
      const walks = response.data;

      const totalWalks = walks.length;
      const totalDistance = walks.reduce((sum, walk) => sum + walk.totalDistance, 0);
      const totalTime = walks.reduce((sum, walk) => sum + safeParseInt(walk.totalTime, 0), 0);
      const averagePace = totalDistance > 0 
        ? totalTime / totalDistance  // 초/미터
        : 0;

      setStats({
        totalWalks,
        totalDistance,
        totalTime,
        averagePace,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '통계를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('통계 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
    clearError,
  };
};

// 산책 경로 관련 훅들은 나중에 구현 예정 

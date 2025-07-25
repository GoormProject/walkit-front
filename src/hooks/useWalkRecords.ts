import { useState, useEffect, useCallback } from 'react';
import type { WalkRecord } from '../types/walk';
import { getWalkRecords, getWalkRecordById, createWalkRecord } from '../utils/api';

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

      const response = await getWalkRecords();
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

      const response = await getWalkRecordById(walkId);
      setWalkRecord(response.data);
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
 * 산책 기록 등록을 위한 커스텀 훅
 */
export const useCreateWalkRecord = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecord = useCallback(async (walkData: {
    memberId: number;
    date: string;
    startedAt: string;
    endedAt: string;
    totalDistance: number;
    totalTime: string;
    pace: string;
    locationName: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createWalkRecord(walkData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '산책 기록 등록에 실패했습니다.';
      setError(errorMessage);
      console.error('산책 기록 등록 실패:', err);
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
 * 산책 기록 통계를 제공하는 커스텀 훅
 */
export const useWalkRecordsStats = () => {
  const { walkRecords } = useWalkRecords();
  
  const stats = {
    total: walkRecords.length,
    totalDistance: walkRecords.reduce((sum, record) => sum + record.totalDistance, 0),
    averageDistance: walkRecords.length > 0 
      ? walkRecords.reduce((sum, record) => sum + record.totalDistance, 0) / walkRecords.length
      : 0,
    totalTime: walkRecords.reduce((sum, record) => {
      const [hours, minutes, seconds] = record.totalTime.split(':').map(Number);
      return sum + hours * 3600 + minutes * 60 + seconds;
    }, 0),
    averagePace: walkRecords.length > 0 
      ? walkRecords.reduce((sum, record) => {
          const [minutes, seconds] = record.pace.split(':').map(Number);
          return sum + minutes * 60 + seconds;
        }, 0) / walkRecords.length
      : 0,
    byLocation: walkRecords.reduce((acc, record) => {
      acc[record.locationName] = (acc[record.locationName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return stats;
}; 

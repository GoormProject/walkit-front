import { useCallback } from 'react';
import { useWalkStore } from '../features/walk/walkSlice';
import type { WalkCreateRequest } from '../types/walk';

export const useWalkApi = () => {
  const { currentWalk, walkRecords, isLoading, error, actions } = useWalkStore();

  // 산책 시작
  const startWalk = useCallback(async () => {
    try {
      await actions.startWalk();
    } catch (error) {
      throw error;
    }
  }, [actions]);

  // 산책 일시정지
  const pauseWalk = useCallback(async () => {
    try {
      await actions.pauseWalk();
    } catch (error) {
      throw error;
    }
  }, [actions]);

  // 산책 재개
  const resumeWalk = useCallback(async () => {
    try {
      await actions.resumeWalk();
    } catch (error) {
      throw error;
    }
  }, [actions]);

  // 산책 종료
  const endWalk = useCallback(async () => {
    try {
      await actions.endWalk(currentWalk.path);
    } catch (error) {
      throw error;
    }
  }, [actions, currentWalk.path]);

  // 산책 기록 등록
  const createWalk = useCallback(async (walkData: WalkCreateRequest) => {
    try {
      await actions.createWalk(walkData);
    } catch (error) {
      throw error;
    }
  }, [actions]);

  // 산책 목록 조회
  const fetchWalkList = useCallback(async () => {
    try {
      await actions.getWalkRecords();
    } catch (error) {
      throw error;
    }
  }, [actions]);

  // 산책 기록 삭제
  const deleteWalk = useCallback(async (walkId: number) => {
    try {
      await actions.deleteWalk(walkId);
    } catch (error) {
      throw error;
    }
  }, [actions]);

  // 경로 업데이트
  const updatePath = useCallback((path: number[][]) => {
    if (!Array.isArray(path)) {
      console.warn('⚠️ 유효하지 않은 경로 데이터 형식:', path);
      return;
    }
    
    // 좌표 형식 검증 (선택적)
    const isValidPath = path.every(coord => 
      Array.isArray(coord) && 
      coord.length === 2 && 
      typeof coord[0] === 'number' && 
      typeof coord[1] === 'number'
    );
    
    if (!isValidPath && path.length > 0) {
      console.warn('⚠️ 일부 좌표가 올바르지 않습니다:', path);
    }
    
    actions.updateWalkPath(path);
  }, [actions]);

  // 에러 초기화
  const clearError = useCallback(() => {
    actions.clearError();
  }, [actions]);

  return {
    // 상태
    walk: { currentWalk, walkRecords, isLoading, error },
    
    // API 함수들
    startWalk,
    pauseWalk,
    resumeWalk,
    endWalk,
    createWalk,
    fetchWalkList,
    deleteWalk,
    
    // 유틸리티 함수들
    updatePath,
    clearError,
  };
}; 

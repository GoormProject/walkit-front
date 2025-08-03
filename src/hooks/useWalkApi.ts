import { useCallback } from 'react';
import { useWalk, useWalkActions } from '../store';
import {
  startWalk as startWalkApi,
  pauseWalk as pauseWalkApi,
  resumeWalk as resumeWalkApi,
  endWalk as endWalkApi,
  createWalk as createWalkApi,
  getWalkList as getWalkListApi,
  deleteWalk as deleteWalkApi,
} from '../utils/walkApi';
import type { WalkCreateRequest } from '../types/walk';

export const useWalkApi = () => {
  const walk = useWalk();
  const actions = useWalkActions();

  // 산책 시작
  const startWalk = useCallback(async () => {
    try {
      actions.setWalkLoading(true);
      actions.setWalkError(null);
      
      const response = await startWalkApi();
      
      actions.startWalk(response.data.walkId, response.data.eventId);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '산책 시작에 실패했습니다.';
      actions.setWalkError(errorMessage);
      throw error;
    } finally {
      actions.setWalkLoading(false);
    }
  }, [actions]);

  // 산책 일시정지
  const pauseWalk = useCallback(async () => {
    if (!walk.currentWalk.walkId) {
      throw new Error('진행 중인 산책이 없습니다.');
    }

    try {
      actions.setWalkLoading(true);
      actions.setWalkError(null);
      
      const response = await pauseWalkApi(walk.currentWalk.walkId);
      
      actions.pauseWalk();
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '산책 일시정지에 실패했습니다.';
      actions.setWalkError(errorMessage);
      throw error;
    } finally {
      actions.setWalkLoading(false);
    }
  }, [walk.currentWalk.walkId, actions]);

  // 산책 재개
  const resumeWalk = useCallback(async () => {
    if (!walk.currentWalk.walkId) {
      throw new Error('진행 중인 산책이 없습니다.');
    }

    try {
      actions.setWalkLoading(true);
      actions.setWalkError(null);
      
      const response = await resumeWalkApi(walk.currentWalk.walkId);
      
      actions.resumeWalk();
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '산책 재개에 실패했습니다.';
      actions.setWalkError(errorMessage);
      throw error;
    } finally {
      actions.setWalkLoading(false);
    }
  }, [walk.currentWalk.walkId, actions]);

  // 산책 종료
  const endWalk = useCallback(async () => {
    if (!walk.currentWalk.walkId) {
      throw new Error('진행 중인 산책이 없습니다.');
    }

    if (!walk.currentWalk.path || walk.currentWalk.path.length === 0) {
      throw new Error('유효한 산책 경로가 없습니다.');
    }

    try {
      actions.setWalkLoading(true);
      actions.setWalkError(null);
      
      const response = await endWalkApi(walk.currentWalk.walkId, walk.currentWalk.path);
      
      actions.endWalk();
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '산책 종료에 실패했습니다.';
      actions.setWalkError(errorMessage);
      throw error;
    } finally {
      actions.setWalkLoading(false);
    }
  }, [walk.currentWalk.walkId, walk.currentWalk.path, actions]);

  // 산책 기록 등록
  const createWalk = useCallback(async (walkData: WalkCreateRequest) => {
    try {
      actions.setWalkLoading(true);
      actions.setWalkError(null);
      
      const response = await createWalkApi(walkData);
      
      // 산책 상태 초기화
      actions.resetWalk();
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '산책 기록 등록에 실패했습니다.';
      actions.setWalkError(errorMessage);
      throw error;
    } finally {
      actions.setWalkLoading(false);
    }
  }, [actions]);

  // 산책 목록 조회
  const fetchWalkList = useCallback(async () => {
    try {
      actions.setWalkLoading(true);
      actions.setWalkError(null);
      
      const response = await getWalkListApi();
      
      actions.setWalkList(response.data);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '산책 목록 조회에 실패했습니다.';
      actions.setWalkError(errorMessage);
      throw error;
    } finally {
      actions.setWalkLoading(false);
    }
  }, [actions]);

  // 산책 기록 삭제
  const deleteWalk = useCallback(async (walkId: number) => {
    try {
      actions.setWalkLoading(true);
      actions.setWalkError(null);
      
      const response = await deleteWalkApi(walkId);
      
      // 목록에서 삭제
      actions.removeWalkRecord(walkId);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '산책 기록 삭제에 실패했습니다.';
      actions.setWalkError(errorMessage);
      throw error;
    } finally {
      actions.setWalkLoading(false);
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
    actions.setWalkError(null);
  }, [actions]);

  return {
    // 상태
    walk,
    
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

import { create } from 'zustand';
import type {
  WalkRecord,
  WalkCreateRequest,
  CurrentWalk,
  WalkStartApiResponse,
  WalkEventApiResponse,
  WalkCreateApiResponse,
  WalkDeleteApiResponse,
  WalkListResponse,
} from '@/types/walk';
import { WalkStatus } from '@/types/walk';
import {
  startWalk,
  pauseWalk,
  resumeWalk,
  endWalk,
  createWalk,
  getWalkList,
  deleteWalk,
} from '@/utils/walkApi';

interface WalkState {
  // 현재 진행 중인 산책
  currentWalk: CurrentWalk;
  
  // 산책 기록 목록
  walkRecords: WalkRecord[];
  
  // UI 상태
  isLoading: boolean;
  error: string | null;
  
  // 액션들
  actions: {
    // 산책 시작
    startWalk: () => Promise<void>;
    
    // 산책 일시정지
    pauseWalk: () => Promise<void>;
    
    // 산책 재개
    resumeWalk: () => Promise<void>;
    
    // 산책 종료
    endWalk: (path: number[][]) => Promise<void>;
    
    // 산책 기록 등록
    createWalk: (data: WalkCreateRequest) => Promise<void>;
    
    // 산책 기록 목록 조회
    getWalkRecords: () => Promise<void>;
    
    // 산책 기록 삭제
    deleteWalk: (walkId: number) => Promise<void>;
    
    // 경로 좌표 추가
    addPathCoordinate: (coordinate: number[]) => void;
    
    // 상태 초기화
    resetWalk: () => void;
    
    // 에러 초기화
    clearError: () => void;
  };
}

export const useWalkStore = create<WalkState>()((set, get) => ({
  // 초기 상태
  currentWalk: {
    walkId: null,
    eventId: null,
    status: WalkStatus.IDLE,
    startTime: null,
    path: [],
  },
  
  walkRecords: [],
  isLoading: false,
  error: null,
  
  actions: {
    // 산책 시작
    startWalk: async () => {
      set({ isLoading: true, error: null });
      
      try {
        console.log('🚶 산책 시작 API 호출');
        const response: WalkStartApiResponse = await startWalk();
        
        const { walkId, eventId, eventTime } = response.data;
        
        set({
          currentWalk: {
            walkId,
            eventId,
            status: WalkStatus.WALKING,
            startTime: eventTime,
            path: [],
          },
          isLoading: false,
        });
        
        console.log('✅ 산책 시작 성공:', { walkId, eventId });
      } catch (error) {
        console.error('❌ 산책 시작 실패:', error);
        set({
          error: error instanceof Error ? error.message : '산책 시작에 실패했습니다.',
          isLoading: false,
        });
      }
    },
    
    // 산책 일시정지
    pauseWalk: async () => {
      const { currentWalk } = get();
      if (!currentWalk.walkId) {
        set({ error: '진행 중인 산책이 없습니다.' });
        return;
      }
      
      set({ isLoading: true, error: null });
      
      try {
        console.log('⏸️ 산책 일시정지 API 호출');
        const response: WalkEventApiResponse = await pauseWalk(currentWalk.walkId);
        
        set({
          currentWalk: {
            ...currentWalk,
            status: WalkStatus.PAUSED,
          },
          isLoading: false,
        });
        
        console.log('✅ 산책 일시정지 성공:', response.data);
      } catch (error) {
        console.error('❌ 산책 일시정지 실패:', error);
        set({
          error: error instanceof Error ? error.message : '산책 일시정지에 실패했습니다.',
          isLoading: false,
        });
      }
    },
    
    // 산책 재개
    resumeWalk: async () => {
      const { currentWalk } = get();
      if (!currentWalk.walkId) {
        set({ error: '진행 중인 산책이 없습니다.' });
        return;
      }
      
      set({ isLoading: true, error: null });
      
      try {
        console.log('▶️ 산책 재개 API 호출');
        const response: WalkEventApiResponse = await resumeWalk(currentWalk.walkId);
        
        set({
          currentWalk: {
            ...currentWalk,
            status: WalkStatus.WALKING,
          },
          isLoading: false,
        });
        
        console.log('✅ 산책 재개 성공:', response.data);
      } catch (error) {
        console.error('❌ 산책 재개 실패:', error);
        set({
          error: error instanceof Error ? error.message : '산책 재개에 실패했습니다.',
          isLoading: false,
        });
      }
    },
    
    // 산책 종료
    endWalk: async (path: number[][]) => {
      const { currentWalk } = get();
      if (!currentWalk.walkId) {
        set({ error: '진행 중인 산책이 없습니다.' });
        return;
      }
      
      set({ isLoading: true, error: null });
      
      try {
        console.log('🏁 산책 종료 API 호출');
        const response: WalkEventApiResponse = await endWalk(currentWalk.walkId, path);
        
        set({
          currentWalk: {
            ...currentWalk,
            status: WalkStatus.COMPLETED,
            path,
          },
          isLoading: false,
        });
        
        console.log('✅ 산책 종료 성공:', response.data);
      } catch (error) {
        console.error('❌ 산책 종료 실패:', error);
        set({
          error: error instanceof Error ? error.message : '산책 종료에 실패했습니다.',
          isLoading: false,
        });
      }
    },
    
    // 산책 기록 등록
    createWalk: async (data: WalkCreateRequest) => {
      set({ isLoading: true, error: null });
      
      try {
        console.log('📝 산책 기록 등록 API 호출');
        const response: WalkCreateApiResponse = await createWalk(data);
        
        // 등록 후 목록 새로고침
        await get().actions.getWalkRecords();
        
        set({ isLoading: false });
        console.log('✅ 산책 기록 등록 성공:', response.data);
      } catch (error) {
        console.error('❌ 산책 기록 등록 실패:', error);
        set({
          error: error instanceof Error ? error.message : '산책 기록 등록에 실패했습니다.',
          isLoading: false,
        });
      }
    },
    
    // 산책 기록 목록 조회
    getWalkRecords: async () => {
      set({ isLoading: true, error: null });
      
      try {
        console.log('📋 산책 기록 목록 조회 API 호출');
        const response: WalkListResponse = await getWalkList();
        
        set({
          walkRecords: response.data,
          isLoading: false,
        });
        
        console.log('✅ 산책 기록 목록 조회 성공:', response.data.length, '개');
      } catch (error) {
        console.error('❌ 산책 기록 목록 조회 실패:', error);
        set({
          error: error instanceof Error ? error.message : '산책 기록 목록 조회에 실패했습니다.',
          isLoading: false,
        });
      }
    },
    
    // 산책 기록 삭제
    deleteWalk: async (walkId: number) => {
      set({ isLoading: true, error: null });
      
      try {
        console.log('🗑️ 산책 기록 삭제 API 호출');
        const response: WalkDeleteApiResponse = await deleteWalk(walkId);
        
        // 삭제 후 목록에서 제거
        set(state => ({
          walkRecords: state.walkRecords.filter(record => record.walkId !== walkId),
          isLoading: false,
        }));
        
        console.log('✅ 산책 기록 삭제 성공:', response.data);
      } catch (error) {
        console.error('❌ 산책 기록 삭제 실패:', error);
        set({
          error: error instanceof Error ? error.message : '산책 기록 삭제에 실패했습니다.',
          isLoading: false,
        });
      }
    },
    
    // 경로 좌표 추가
    addPathCoordinate: (coordinate: number[]) => {
      set(state => ({
        currentWalk: {
          ...state.currentWalk,
          path: [...state.currentWalk.path, coordinate],
        },
      }));
    },
    
    // 상태 초기화
    resetWalk: () => {
      set({
        currentWalk: {
          walkId: null,
          eventId: null,
          status: WalkStatus.IDLE,
          startTime: null,
          path: [],
        },
        error: null,
      });
    },
    
    // 에러 초기화
    clearError: () => {
      set({ error: null });
    },
  },
})); 

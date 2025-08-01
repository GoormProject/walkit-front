import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WalkRecord, WalkStatus, CurrentWalk } from '../types/walk';

// 테마 타입 정의
type Theme = 'light' | 'dark';

// localStorage에서 테마 읽기 함수
const getInitialTheme = (): Theme => {
  try {
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    return savedTheme === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('localStorage에서 테마를 읽어오는 중 오류 발생:', error);
    return 'light';
  }
};

// 기본 상태 타입 정의
interface AppState {
  // 사용자 관련 상태
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
    isLoggedIn: boolean;
  };

  // UI 관련 상태
  ui: {
    isLoading: boolean;
    theme: Theme;
    sidebarOpen: boolean;
  };

  // 산책 관련 상태
  walk: {
    currentWalk: CurrentWalk;
    walkList: WalkRecord[];
    loading: boolean;
    error: string | null;
  };

  // 액션들
  actions: {
    // 사용자 액션
    setUser: (user: { id: string; name: string; email: string }) => void;
    logout: () => void;

    // UI 액션
    setLoading: (loading: boolean) => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;

    // 산책 액션
    startWalk: (walkId: number, eventId: number) => void;
    pauseWalk: () => void;
    resumeWalk: () => void;
    endWalk: () => void;
    resetWalk: () => void;
    updateWalkPath: (path: number[][]) => void;
    setWalkList: (walkList: WalkRecord[]) => void;
    addWalkRecord: (walkRecord: WalkRecord) => void;
    removeWalkRecord: (walkId: number) => void;
    setWalkError: (error: string | null) => void;
    setWalkLoading: (loading: boolean) => void;
  };
}

// Zustand 스토어 생성
export const useAppStore = create<AppState>()(
  devtools(
    set => ({
      // 초기 상태
      user: {
        id: null,
        name: null,
        email: null,
        isLoggedIn: false,
      },

      ui: {
        isLoading: false,
        theme: getInitialTheme(), // localStorage에서 초기 테마 읽기
        sidebarOpen: false,
      },

      walk: {
        currentWalk: {
          walkId: null,
          eventId: null,
          status: 'idle' as WalkStatus,
          startTime: null,
          path: [],
        },
        walkList: [],
        loading: false,
        error: null,
      },

      // 액션들
      actions: {
        // 사용자 설정
        setUser: user =>
          set(
            state => ({
              user: {
                ...state.user,
                ...user,
                isLoggedIn: true,
              },
            }),
            false,
            'setUser'
          ),

        // 로그아웃
        logout: () =>
          set(
            () => ({
              user: {
                id: null,
                name: null,
                email: null,
                isLoggedIn: false,
              },
            }),
            false,
            'logout'
          ),

        // 로딩 상태 설정
        setLoading: loading =>
          set(
            state => ({
              ui: {
                ...state.ui,
                isLoading: loading,
              },
            }),
            false,
            'setLoading'
          ),

        // 테마 토글 (localStorage 동기화 포함)
        toggleTheme: () =>
          set(
            state => {
              const newTheme: Theme =
                state.ui.theme === 'light' ? 'dark' : 'light';

              // localStorage에 테마 저장
              try {
                localStorage.setItem('app-theme', newTheme);
              } catch (error) {
                console.error(
                  'localStorage에 테마를 저장하는 중 오류 발생:',
                  error
                );
              }

              return {
                ui: {
                  ...state.ui,
                  theme: newTheme,
                },
              };
            },
            false,
            'toggleTheme'
          ),

        // 사이드바 토글
        toggleSidebar: () =>
          set(
            state => ({
              ui: {
                ...state.ui,
                sidebarOpen: !state.ui.sidebarOpen,
              },
            }),
            false,
            'toggleSidebar'
          ),

        // 산책 시작
        startWalk: (walkId: number, eventId: number) =>
          set(
            state => ({
              walk: {
                ...state.walk,
                currentWalk: {
                  walkId,
                  eventId,
                  status: 'walking' as WalkStatus,
                  startTime: new Date().toISOString(),
                  path: [],
                },
                error: null,
              },
            }),
            false,
            'startWalk'
          ),

        // 산책 일시정지
        pauseWalk: () =>
          set(
            state => ({
              walk: {
                ...state.walk,
                currentWalk: {
                  ...state.walk.currentWalk,
                  status: 'paused' as WalkStatus,
                },
              },
            }),
            false,
            'pauseWalk'
          ),

        // 산책 재개
        resumeWalk: () =>
          set(
            state => ({
              walk: {
                ...state.walk,
                currentWalk: {
                  ...state.walk.currentWalk,
                  status: 'walking' as WalkStatus,
                },
              },
            }),
            false,
            'resumeWalk'
          ),

        // 산책 종료
        endWalk: () =>
          set(
            state => ({
              walk: {
                ...state.walk,
                currentWalk: {
                  ...state.walk.currentWalk,
                  status: 'completed' as WalkStatus,
                },
              },
            }),
            false,
            'endWalk'
          ),

        // 산책 상태 초기화
        resetWalk: () =>
          set(
            state => ({
              walk: {
                ...state.walk,
                currentWalk: {
                  walkId: null,
                  eventId: null,
                  status: 'idle' as WalkStatus,
                  startTime: null,
                  path: [],
                },
                error: null,
              },
            }),
            false,
            'resetWalk'
          ),

        // 산책 경로 업데이트
        updateWalkPath: (path: number[][]) =>
          set(
            state => ({
              walk: {
                ...state.walk,
                currentWalk: {
                  ...state.walk.currentWalk,
                  path,
                },
              },
            }),
            false,
            'updateWalkPath'
          ),

        // 산책 목록 설정
        setWalkList: (walkList: WalkRecord[]) =>
          set(
            state => ({
              walk: {
                ...state.walk,
                walkList,
                error: null,
              },
            }),
            false,
            'setWalkList'
          ),

        // 산책 기록 추가
        addWalkRecord: (walkRecord: WalkRecord) =>
          set(
            state => ({
              walk: {
                ...state.walk,
                walkList: [walkRecord, ...state.walk.walkList],
              },
            }),
            false,
            'addWalkRecord'
          ),

        // 산책 기록 삭제
        removeWalkRecord: (walkId: number) =>
          set(
            state => ({
              walk: {
                ...state.walk,
                walkList: state.walk.walkList.filter(walk => walk.walkId !== walkId),
              },
            }),
            false,
            'removeWalkRecord'
          ),

        // 산책 에러 설정
        setWalkError: (error: string | null) =>
          set(
            state => ({
              walk: {
                ...state.walk,
                error,
              },
            }),
            false,
            'setWalkError'
          ),

        // 산책 로딩 상태 설정
        setWalkLoading: (loading: boolean) =>
          set(
            state => ({
              walk: {
                ...state.walk,
                loading,
              },
            }),
            false,
            'setWalkLoading'
          ),
      },
    }),
    {
      name: 'app-store', // Redux DevTools에서 보일 이름
    }
  )
);

// 편의를 위한 훅들
export const useUser = () => useAppStore(state => state.user);
export const useUserActions = () => useAppStore(state => state.actions);
export const useUI = () => useAppStore(state => state.ui);
export const useUIActions = () =>
  useAppStore(state => ({
    setLoading: state.actions.setLoading,
    toggleTheme: state.actions.toggleTheme,
    toggleSidebar: state.actions.toggleSidebar,
  }));

// 산책 관련 훅들
export const useWalk = () => useAppStore(state => state.walk);
export const useWalkActions = () => useAppStore(state => state.actions);

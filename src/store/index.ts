import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// 기본 상태 타입 정의
interface AppState {
  // 사용자 관련 상태
  user: {
    id: string | null
    name: string | null
    email: string | null
    isLoggedIn: boolean
  }
  
  // UI 관련 상태
  ui: {
    isLoading: boolean
    theme: 'light' | 'dark'
    sidebarOpen: boolean
  }
  
  // 액션들
  actions: {
    // 사용자 액션
    setUser: (user: { id: string; name: string; email: string }) => void
    logout: () => void
    
    // UI 액션
    setLoading: (loading: boolean) => void
    toggleTheme: () => void
    toggleSidebar: () => void
  }
}

// Zustand 스토어 생성
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // 초기 상태
      user: {
        id: null,
        name: null,
        email: null,
        isLoggedIn: false,
      },
      
      ui: {
        isLoading: false,
        theme: 'light',
        sidebarOpen: false,
      },
      
      // 액션들
      actions: {
        // 사용자 설정
        setUser: (user) => set(
          (state) => ({
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
        logout: () => set(
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
        setLoading: (loading) => set(
          (state) => ({
            ui: {
              ...state.ui,
              isLoading: loading,
            },
          }),
          false,
          'setLoading'
        ),
        
        // 테마 토글
        toggleTheme: () => set(
          (state) => ({
            ui: {
              ...state.ui,
              theme: state.ui.theme === 'light' ? 'dark' : 'light',
            },
          }),
          false,
          'toggleTheme'
        ),
        
        // 사이드바 토글
        toggleSidebar: () => set(
          (state) => ({
            ui: {
              ...state.ui,
              sidebarOpen: !state.ui.sidebarOpen,
            },
          }),
          false,
          'toggleSidebar'
        ),
      },
    }),
    {
      name: 'app-store', // Redux DevTools에서 보일 이름
    }
  )
)

// 편의를 위한 훅들
export const useUser = () => useAppStore((state) => state.user)
export const useUserActions = () => useAppStore((state) => state.actions)
export const useUI = () => useAppStore((state) => state.ui)
export const useUIActions = () => useAppStore((state) => state.actions)

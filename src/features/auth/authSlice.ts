import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Api } from '@/api/swagger-api';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    memberId: string | null; // API에서 받은 memberId
    email: string | null; // API에서 받은 email
  };
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  oauthLoginSuccess: (userData: {
    memberId: number;
    email: string;
    isProfileSet: boolean;
  }) => void;
  login: () => Promise<void>;
  signup: () => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// 환경변수 체크 (개발 환경에서만 사용)
const isBypassEnabled =
  import.meta.env.NODE_ENV === 'development' &&
  import.meta.env.VITE_BYPASS_AUTH === 'true';
const isTestJwtEnabled =
  import.meta.env.NODE_ENV === 'development' &&
  import.meta.env.VITE_TEST_JWT === 'true';

// 환경변수 디버깅
console.log('🔧 환경변수 확인:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  VITE_BYPASS_AUTH: import.meta.env.VITE_BYPASS_AUTH,
  VITE_TEST_JWT: import.meta.env.VITE_TEST_JWT,
  isBypassEnabled,
  isTestJwtEnabled,
});

// Zustand 스토어 생성 - 로그인 성공 시에만 persist
export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      // 초기 상태 - 환경변수 반영 (persist 없이)
      isAuthenticated: isBypassEnabled || isTestJwtEnabled,
      user:
        isBypassEnabled || isTestJwtEnabled
          ? {
              memberId: '1',
              email: 'test@example.com',
            }
          : {
              memberId: null,
              email: null,
            },
      isLoading: false,
      error: null,

      // 액션들
      oauthLoginSuccess: userData => {
        // OAuth 로그인 성공 시에만 persist에 저장
        console.log('🔄 OAuth 로그인 성공 처리:', userData);

        set({
          isAuthenticated: true,
          user: {
            memberId: userData.memberId.toString(),
            email: userData.email,
          },
          isLoading: false,
          error: null,
        });

        console.log('✅ OAuth 로그인 성공 - 상태 업데이트 완료');
      },

      login: async () => {
        set({ isLoading: true, error: null });
        try {
          // 실제 로그인 성공 시에만 persist에 저장
          // throw new Error('Backend API not implemented yet');

          // 임시 성공 처리 (테스트용)
          console.log('🔐 로그인 성공 처리 시작');
          set({
            isAuthenticated: true,
            user: {
              memberId: 'login-user-1',
              email: 'login@example.com',
            },
            isLoading: false,
            error: null,
          });
          console.log('✅ 로그인 성공 - 상태 업데이트 완료');
          console.log(
            '💾 localStorage에 저장됨:',
            localStorage.getItem('auth-storage')
          );
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
        }
      },

      signup: async () => {
        set({ isLoading: true, error: null });
        try {
          // 실제 회원가입 성공 시에만 persist에 저장
          throw new Error('Backend API not implemented yet');
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Signup failed',
            isLoading: false,
          });
        }
      },

      logout: () => {
        // 로그아웃 시 persist에서 제거
        set({
          isAuthenticated: false,
          user: {
            memberId: null,
            email: null,
          },
          isLoading: false,
          error: null,
        });
      },

      validateToken: async () => {
        try {
          // API 인스턴스 생성
          const api = new Api({
            baseURL: import.meta.env.VITE_API_BASE_URL,
          });

          // 현재 사용자 정보 조회
          const response = await api.api.getCurrentUser();
          console.log('🔍 현재 사용자 조회 성공:', response.data);

          if (response.data?.data) {
            const userData = response.data.data;
            // 사용자 정보로 상태 업데이트
            set({
              isAuthenticated: true,
              user: {
                memberId: userData.memberId?.toString() || '',
                email: userData.email || '',
              },
              isLoading: false,
              error: null,
            });
            return true;
          }
          return false;
        } catch (error: unknown) {
          console.error('❌ 현재 사용자 조회 실패:', error);
          // 401 에러면 인증되지 않은 상태
          if ((error as any)?.response?.status === 401) {
            set({
              isAuthenticated: false,
              user: {
                memberId: null,
                email: null,
              },
              isLoading: false,
              error: null,
            });
          }
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      // 로그인 성공한 상태만 persist
      partialize: state => {
        // 인증된 상태일 때만 저장
        if (state.isAuthenticated && state.user.memberId) {
          return {
            isAuthenticated: state.isAuthenticated,
            user: state.user,
          };
        }
        // 인증되지 않은 상태면 저장하지 않음
        return {};
      },
      // 초기화 시 환경변수 우선 적용
      onRehydrateStorage: () => state => {
        if (state && (isBypassEnabled || isTestJwtEnabled)) {
          state.isAuthenticated = true;
          state.user = {
            memberId: '1',
            email: 'test@example.com',
          };
        }
      },
    }
  )
);

// 커스텀 훅들
export const useAuth = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
  };
};

export const useAuthActions = () => {
  const oauthLoginSuccess = useAuthStore(state => state.oauthLoginSuccess);
  const login = useAuthStore(state => state.login);
  const signup = useAuthStore(state => state.signup);
  const logout = useAuthStore(state => state.logout);
  const validateToken = useAuthStore(state => state.validateToken);
  const clearError = useAuthStore(state => state.clearError);
  const setLoading = useAuthStore(state => state.setLoading);

  return {
    oauthLoginSuccess,
    login,
    signup,
    logout,
    validateToken,
    clearError,
    setLoading,
  };
};

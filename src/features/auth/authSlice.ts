import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// 인증 상태 타입 정의
interface AuthState {
  // 인증 상태
  isAuthenticated: boolean;
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
    token: string | null;
  };

  // 로딩 상태
  isLoading: boolean;
  error: string | null;

  // 액션들
  actions: {
    // 로그인
    login: (credentials: { email: string; password: string }) => Promise<void>;

    // 회원가입
    signup: (userData: {
      email: string;
      password: string;
      name: string;
    }) => Promise<void>;

    // 로그아웃
    logout: () => void;

    // 토큰 검증
    validateToken: () => Promise<boolean>;

    // 에러 초기화
    clearError: () => void;

    // 로딩 상태 설정
    setLoading: (loading: boolean) => void;
  };
}

// 인증 우회 여부 확인
const isBypassEnabled = import.meta.env.VITE_BYPASS_AUTH === 'true';

// 테스트 JWT 토큰 사용 여부 확인
const isTestJwtEnabled = import.meta.env.VITE_TEST_JWT === 'true';

// Zustand 스토어 생성
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태 (우회 모드 또는 테스트 JWT 모드일 때는 인증된 것으로 처리)
        isAuthenticated: isBypassEnabled || isTestJwtEnabled,
        user:
          isBypassEnabled || isTestJwtEnabled
            ? {
                id: 'test-user-1',
                email: 'test@example.com',
                name: 'Test User',
                token: 'test-jwt-token-static',
              }
            : {
                id: null,
                email: null,
                name: null,
                token: null,
              },
        isLoading: false,
        error: null,

        // 액션들
        actions: {
          // 로그인
          login: async credentials => {
            set({ isLoading: true, error: null });

            try {
              // 우회 모드인 경우 자동 로그인
              if (isBypassEnabled) {
                // 임시 사용자 데이터
                const mockUser = {
                  id: 'bypass-user-1',
                  email: credentials.email,
                  name: 'Bypass User',
                  token: 'bypass-token-' + Date.now(),
                };

                set({
                  isAuthenticated: true,
                  user: mockUser,
                  isLoading: false,
                });
                return;
              }

              // 실제 API 호출 (백엔드 구현 후)
              // const response = await authAPI.login(credentials)
              // set({ isAuthenticated: true, user: response.user, isLoading: false })

              // 임시로 실패 처리
              throw new Error('Backend API not implemented yet');
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Login failed',
                isLoading: false,
              });
            }
          },

          // 회원가입
          signup: async userData => {
            set({ isLoading: true, error: null });

            try {
              // 우회 모드인 경우 자동 회원가입
              if (isBypassEnabled) {
                const mockUser = {
                  id: 'bypass-user-' + Date.now(),
                  email: userData.email,
                  name: userData.name,
                  token: 'bypass-token-' + Date.now(),
                };

                set({
                  isAuthenticated: true,
                  user: mockUser,
                  isLoading: false,
                });
                return;
              }

              // 실제 API 호출 (백엔드 구현 후)
              // const response = await authAPI.signup(userData)
              // set({ isAuthenticated: true, user: response.user, isLoading: false })

              // 임시로 실패 처리
              throw new Error('Backend API not implemented yet');
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Signup failed',
                isLoading: false,
              });
            }
          },

          // 로그아웃
          logout: () => {
            set({
              isAuthenticated: false,
              user: {
                id: null,
                email: null,
                name: null,
                token: null,
              },
              error: null,
            });
          },

          // 토큰 검증
          validateToken: async () => {
            const { user } = get();

            if (!user.token) {
              return false;
            }

            // 우회 모드인 경우 항상 유효
            if (isBypassEnabled) {
              return true;
            }

            try {
              // 실제 토큰 검증 API 호출 (백엔드 구현 후)
              // const isValid = await authAPI.validateToken(user.token)
              // return isValid

              // 임시로 실패 처리
              return false;
            } catch (error) {
              return false;
            }
          },

          // 에러 초기화
          clearError: () => {
            set({ error: null });
          },

          // 로딩 상태 설정
          setLoading: loading => {
            set({ isLoading: loading });
          },
        },
      }),
      {
        name: 'auth-storage', // localStorage 키 이름
        partialize: state => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// 편의를 위한 훅들
export const useAuth = () =>
  useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
  }));

export const useAuthActions = () => useAuthStore(state => state.actions);

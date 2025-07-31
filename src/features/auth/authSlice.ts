import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Api } from '@/api/swagger-api';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    memberId: string | null; // API에서 받은 memberId
    email: string | null; // API에서 받은 email
    deviceId: string | null; // 디바이스 ID
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
      user: {
        memberId: null,
        email: null,
        deviceId: null,
      },
      isLoading: false,
      error: null,

      // 액션들
      oauthLoginSuccess: userData => {
        // OAuth 로그인 성공 시에만 persist에 저장
        console.log('🔄 OAuth 로그인 성공 처리 시작');
        console.log('📊 받은 userData:', userData);

        // deviceId 생성 (로그인 성공 시에만)
        const deviceId = crypto.randomUUID();
        console.log('📱 Device ID 생성 (로그인 성공):', deviceId);

        const newState = {
          isAuthenticated: true,
          user: {
            memberId: userData.memberId.toString(),
            email: userData.email,
            deviceId: deviceId, // 로그인 성공 시 생성
          },
          isLoading: false,
          error: null,
        };

        console.log('📊 설정할 새 상태:', newState);

        set(newState);

        console.log('✅ OAuth 로그인 성공 - 상태 업데이트 완료');

        // 업데이트 후 상태 확인
        setTimeout(() => {
          const updatedState = useAuthStore.getState();
          console.log('🔍 업데이트 후 store 상태:', updatedState);
          console.log('📱 업데이트 후 deviceId:', updatedState.user.deviceId);
        }, 100);
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
              deviceId: null,
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
        // 로그아웃 시 auth-storage 자체를 삭제
        localStorage.removeItem('auth-storage');

        // 상태도 초기화
        set({
          isAuthenticated: false,
          user: {
            memberId: null,
            email: null,
            deviceId: null,
          },
          isLoading: false,
          error: null,
        });
      },

      validateToken: async () => {
        try {
          console.log('🔍 validateToken 시작 - 현재 상태 확인');
          const currentState = useAuthStore.getState();
          console.log('📊 현재 store 상태:', currentState);
          console.log('📱 현재 deviceId:', currentState.user.deviceId);

          // API 인스턴스 생성 (쿠키 전송 설정 추가)
          const api = new Api({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            withCredentials: true, // HttpOnly 쿠키 전송을 위해 필요
          });

          // 현재 사용자 정보 조회
          const response = await api.api.getCurrentUser();
          console.log('🔍 현재 사용자 조회 성공:', response.data);

          if (response.data?.data) {
            const userData = response.data.data;
            console.log('✅ validateToken - 사용자 정보 확인됨');
            console.log('👤 API 응답 사용자 정보:', userData);

            // deviceId가 없으면 새로 생성
            let deviceId = currentState.user.deviceId;
            if (!deviceId) {
              deviceId = crypto.randomUUID();
              console.log('📱 Device ID 새로 생성 (validateToken):', deviceId);
            } else {
              console.log('📱 기존 deviceId 유지:', deviceId);
            }

            // 사용자 정보로 상태 업데이트
            set({
              isAuthenticated: true,
              user: {
                memberId: userData.memberId?.toString() || '',
                email: userData.email || '',
                deviceId: deviceId, // 기존 또는 새로 생성된 deviceId
              },
              isLoading: false,
              error: null,
            });

            console.log('✅ validateToken 완료 - deviceId 유지됨');
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
                deviceId: null,
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
      // 로그인 성공한 상태만 persist (새로운 구조만 저장)
      partialize: state => {
        console.log('💾 partialize 호출됨');
        console.log('📊 현재 상태:', state);
        console.log('📱 현재 deviceId:', state.user.deviceId);

        // 인증된 상태일 때만 저장
        if (state.isAuthenticated && state.user.memberId) {
          const persistedData = {
            isAuthenticated: state.isAuthenticated,
            user: {
              memberId: state.user.memberId,
              email: state.user.email,
              deviceId: state.user.deviceId,
            },
          };
          console.log('💾 저장할 데이터:', persistedData);
          return persistedData;
        }
        // 인증되지 않은 상태면 저장하지 않음
        console.log('💾 인증되지 않음 - 빈 객체 반환');
        return {};
      },
      // 초기화 시 환경변수 우선 적용
      onRehydrateStorage: () => state => {
        console.log('🔄 onRehydrateStorage 호출됨');
        console.log('📊 복원된 상태:', state);

        if (state) {
          console.log('📱 복원된 deviceId:', state.user?.deviceId);

          // deviceId는 인증된 상태에서만 관리
          // 인증되지 않은 상태에서는 null로 유지

          // 환경변수 우선 적용 (인증 상태만 설정)
          if (isBypassEnabled || isTestJwtEnabled) {
            console.log('🔧 환경변수로 인증 상태 설정');
            state.isAuthenticated = true;
          }
        } else {
          console.log('❌ 복원된 상태가 없음');
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

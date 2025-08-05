import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Api } from '@/api/swagger-api';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    memberId: string | null; // API에서 받은 memberId
    email: string | null; // API에서 받은 email
    deviceId: string | null; // 디바이스 ID
    isProfileSet: boolean | null; // 프로필 설정 여부
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
        isProfileSet: null,
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
            isProfileSet: userData.isProfileSet,
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
          throw new Error('Backend API not implemented yet');
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
            isProfileSet: null,
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

          if (import.meta.env.DEV) {
            console.log('📡 /api/auth/me API 호출 시작...');
          }

          // 현재 사용자 정보 조회
          const response = await api.api.getCurrentUser();

          if (import.meta.env.DEV) {
            console.log('🔍 /api/auth/me API 응답 전체:', response);
            console.log('📊 response.data:', response.data);
            console.log('📊 response.data.data:', response.data?.data);
            console.log('📊 response.status:', response.status);
            console.log('📊 response.headers:', response.headers);
          }

          if (response.data?.data) {
            const userData = response.data.data;
            if (import.meta.env.DEV) {
              console.log('✅ validateToken - 사용자 정보 확인됨');
              console.log('👤 API 응답 사용자 정보:', userData);
              console.log('🔍 userData.memberId:', userData.memberId);
              console.log('🔍 userData.email:', userData.email);
              console.log('🔍 userData.isProfileSet:', userData.isProfileSet);
              console.log(
                '🔍 userData.isProfileSet 타입:',
                typeof userData.isProfileSet
              );
            }

            // deviceId가 없으면 새로 생성
            let deviceId = currentState.user.deviceId;
            if (!deviceId) {
              deviceId = crypto.randomUUID();
              if (import.meta.env.DEV) {
                console.log(
                  '📱 Device ID 새로 생성 (validateToken):',
                  deviceId
                );
              }
            } else {
              if (import.meta.env.DEV) {
                console.log('📱 기존 deviceId 유지:', deviceId);
              }
            }

            // 사용자 정보로 상태 업데이트 (localStorage에 저장됨)
            const newState = {
              isAuthenticated: true,
              user: {
                memberId: userData.memberId?.toString() || '',
                email: userData.email || '',
                deviceId: deviceId, // 기존 또는 새로 생성된 deviceId
                isProfileSet: userData.isProfileSet ?? false,
              },
              isLoading: false,
              error: null,
            };

            if (import.meta.env.DEV) {
              console.log('📊 localStorage에 저장할 새 상태:', newState);
            }
            set(newState);

            if (import.meta.env.DEV) {
              console.log('✅ validateToken 완료 - localStorage에 저장됨');
              // localStorage 내용은 개발 환경에서만 로깅
              console.log(
                '💾 localStorage 확인:',
                localStorage.getItem('auth-storage')
              );
            }
            return true;
          }

          if (import.meta.env.DEV) {
            console.log('❌ 사용자 정보 없음');
          }
          return false;
        } catch (error: unknown) {
          if (import.meta.env.DEV) {
            console.error('❌ /api/auth/me API 호출 실패:', error);
            console.error('🚨 에러 상세:', error);
          }

          // 401 에러면 인증되지 않은 상태
          if ((error as any)?.response?.status === 401) {
            if (import.meta.env.DEV) {
              console.log('🔒 401 에러 - 인증되지 않은 상태로 설정');
            }
            set({
              isAuthenticated: false,
              user: {
                memberId: null,
                email: null,
                deviceId: null,
                isProfileSet: null,
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
        if (import.meta.env.DEV) {
          console.log('💾 partialize 호출됨');
          console.log('📊 현재 상태:', state);
          console.log('📱 현재 deviceId:', state.user.deviceId);
          console.log('👤 현재 isProfileSet:', state.user.isProfileSet);
        }

        // 인증된 상태일 때만 저장
        if (state.isAuthenticated && state.user.memberId) {
          const persistedData = {
            isAuthenticated: state.isAuthenticated,
            user: {
              memberId: state.user.memberId,
              email: state.user.email,
              deviceId: state.user.deviceId,
              isProfileSet: state.user.isProfileSet,
            },
          };
          if (import.meta.env.DEV) {
            console.log('💾 저장할 데이터:', persistedData);
          }
          return persistedData;
        }
        // 인증되지 않은 상태면 저장하지 않음
        if (import.meta.env.DEV) {
          console.log('💾 인증되지 않음 - 빈 객체 반환');
        }
        return {};
      },
      // 초기화 시 환경변수 우선 적용
      onRehydrateStorage: () => state => {
        if (import.meta.env.DEV) {
          console.log('🔄 onRehydrateStorage 호출됨');
          console.log('📊 복원된 상태:', state);
        }

        if (state) {
          if (import.meta.env.DEV) {
            console.log('📱 복원된 deviceId:', state.user?.deviceId);
          }

          // deviceId는 인증된 상태에서만 관리
          // 인증되지 않은 상태에서는 null로 유지

          // 환경변수 우선 적용 (인증 상태만 설정)
          if (isBypassEnabled || isTestJwtEnabled) {
            if (import.meta.env.DEV) {
              console.log('🔧 환경변수로 인증 상태 설정');
            }
            state.isAuthenticated = true;
          }
        } else {
          if (import.meta.env.DEV) {
            console.log('❌ 복원된 상태가 없음');
          }
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

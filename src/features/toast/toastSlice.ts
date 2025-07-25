import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'sonner';

interface ToastState {
  isToastReady: boolean;
  actions: {
    setToastReady: (ready: boolean) => void;
    showToast: (
      type: 'success' | 'error' | 'info' | 'warning',
      message: string
    ) => void;
  };
}

export const useToastStore = create<ToastState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      isToastReady: false,

      // 액션들
      actions: {
        // 토스트 준비 상태 설정
        setToastReady: (ready: boolean) => {
          set({ isToastReady: ready });
        },

        // 토스트 표시
        showToast: (
          type: 'success' | 'error' | 'info' | 'warning',
          message: string
        ) => {
          const { isToastReady } = get();
          if (isToastReady) {
            toast[type](message);
          }
        },
      },
    }),
    { name: 'toast-store' }
  )
);

// 편의를 위한 Hook들
export const useToast = () => {
  const isToastReady = useToastStore(state => state.isToastReady);
  const { showToast } = useToastStore(state => state.actions);

  return { isToastReady, showToast };
};

export const useToastActions = () => useToastStore(state => state.actions);

import { Toaster, toast } from 'sonner';
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useToastActions } from '@/features/toast/toastSlice';

interface ToastProviderProps {
  children: React.ReactNode;
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export interface ToastProviderRef {
  showToast: (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string
  ) => void;
  isReady: () => boolean;
}

const ToastProvider = forwardRef<ToastProviderRef, ToastProviderProps>(
  ({ children }, ref) => {
    const { setToastReady } = useToastActions();
    const isReadyRef = useRef(false); // ref도 유지 (기존 API 호환성)

    useEffect(() => {
      // 토스트 스타일을 동적으로 추가
      const style = document.createElement('style');
      style.textContent = `
        .sonner-toast[data-type="success"] {
          background-color: var(--toast-message-success) !important;
          color: white !important;
        }
        
        .sonner-toast[data-type="error"] {
          background-color: var(--toast-message-error) !important;
          color: white !important;
        }
        
        .sonner-toast[data-type="info"] {
          background-color: var(--toast-message-infomation) !important;
          color: white !important;
        }
        
        .sonner-toast[data-type="warning"] {
          background-color: var(--toast-message-warning) !important;
          color: black !important;
        }
      `;
      document.head.appendChild(style);

      // 스타일 추가 후 준비 완료
      setToastReady(true);
      isReadyRef.current = true;

      return () => {
        document.head.removeChild(style);
      };
    }, [setToastReady]);

    // ref를 통해 외부에서 접근할 수 있는 메서드들 (기존 API 호환성)
    useImperativeHandle(ref, () => ({
      showToast: (type, message) => {
        if (isReadyRef.current) {
          toast[type](message);
        }
      },
      isReady: () => isReadyRef.current,
    }));

    return (
      <>
        {children}
        <Toaster
          position="top-center"
          richColors={true}
          closeButton
          duration={2000}
          expand={true}
        />
      </>
    );
  }
);

ToastProvider.displayName = 'ToastProvider';

export default ToastProvider;

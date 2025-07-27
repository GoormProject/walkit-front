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
    const styleId = 'toast-provider-styles'; // 고유 식별자

    useEffect(() => {
      // 이미 스타일 요소가 존재하는지 확인
      const existingStyle = document.getElementById(styleId);

      if (!existingStyle) {
        // 토스트 스타일을 동적으로 추가
        const style = document.createElement('style');
        style.id = styleId; // 고유 ID 설정
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
            background-color: var(--toast-message-information) !important;
            color: white !important;
          }
          
          .sonner-toast[data-type="warning"] {
            background-color: var(--toast-message-warning) !important;
            color: black !important;
          }
        `;
        document.head.appendChild(style);
      }

      // 스타일 추가 후 준비 완료
      setToastReady(true);
      isReadyRef.current = true;

      return () => {
        // 컴포넌트가 언마운트될 때만 스타일 제거
        // 다른 ToastProvider 인스턴스가 있을 수 있으므로 조건부로 제거
        const styleToRemove = document.getElementById(styleId);
        if (styleToRemove) {
          document.head.removeChild(styleToRemove);
        }
      };
    }, [setToastReady]);

    // ref를 통해 외부에서 접근할 수 있는 메서드들 (기존 API 호환성)
    useImperativeHandle(ref, () => ({
      showToast: (type, message) => {
        if (isReadyRef.current) {
          try {
            toast[type](message);
          } catch (error) {
            console.error('토스트 메시지 표시 중 오류 발생:', error);
            // 기본 토스트로 fallback
            try {
              toast('메시지를 표시할 수 없습니다.');
            } catch (fallbackError) {
              console.error('Fallback 토스트도 실패:', fallbackError);
            }
          }
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

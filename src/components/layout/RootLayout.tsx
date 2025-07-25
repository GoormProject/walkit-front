import { Outlet, useLocation } from 'react-router-dom';
import { useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToastProvider, {
  type ToastProviderRef,
} from '@/components/providers/ToastProvider';
import '@/styles/rootlayout.css';

/**
 * 기본 레이아웃 컴포넌트
 * Outlet을 사용하여 중첩 라우팅을 지원
 */
const RootLayout = () => {
  const location = useLocation();
  const toastRef = useRef<ToastProviderRef>(null);

  // Header를 숨길 페이지들
  const hideHeaderPaths = ['/']; // 이 배열 안의 URL 에서는 Header 가 숨겨짐
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <ToastProvider ref={toastRef}>
      <div className="app">
        {shouldShowHeader && <Header />}

        {/* 메인 콘텐츠 영역 */}
        <main>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              메인 콘텐츠 영역
            </h2>
            <div className="p-4 bg-gray-100 rounded text-sm text-gray-600">
              여기에 실제 페이지 콘텐츠가 들어갑니다
            </div>
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
};

export default RootLayout;

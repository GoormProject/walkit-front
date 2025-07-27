import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/features/toast/toastSlice';

const NotFound = () => {
  const { isToastReady, showToast } = useToast();

  // useEffect: 컴포넌트 마운트 후 실행
  useEffect(() => {
    console.log('NotFound 페이지 진입');
    console.log('Toast 준비 상태:', isToastReady);

    if (isToastReady) {
      console.log('토스트 준비됨! 바로 표시');
      showToast('error', '존재하지 않는 페이지 입니다.');
    } else {
      console.log('토스트 아직 준비 안됨, 지연 후 시도');
      // 토스트가 준비되지 않았다면 약간의 지연 후 다시 시도
      const timer = setTimeout(() => {
        if (isToastReady) {
          showToast('error', '존재하지 않는 페이지 입니다.');
        }
      }, 100);

      return () => {
        clearTimeout(timer); // 타이머 정리 (메모리 누수 방지)
      };
    }
  }, [isToastReady, showToast]);

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="text-lg mb-6">요청하신 페이지가 존재하지 않습니다.</p>

      {/* 토스트 테스트 버튼들 */}
      {/* <div className="mb-6 space-x-4">
        <button
          onClick={() => toast.error('에러 토스트 테스트')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          에러 토스트
        </button>
        <button
          onClick={() => toast.success('성공 토스트 테스트')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          성공 토스트
        </button>
        <button
          onClick={() => toast.info('정보 토스트 테스트')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          정보 토스트
        </button>
      </div> */}

      <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;

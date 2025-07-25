import { Link } from 'react-router-dom';
import DesignTokensDemo from '../components/DesignTokensDemo';
import KakaoMap from '../components/KakaoMap';

const Home = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Walkit 홈</h1>
      <p className="text-lg mb-4">산책 앱에 오신 것을 환영합니다!</p>

      {/* 카카오 맵 섹션 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          🗺️ 실시간 위치 기반 산책 지도
        </h2>
        <KakaoMap />
      </div>

      {/* 네비게이션 링크 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">📱 앱 기능</h3>
        <div className="space-y-2">
          <Link
            to="/friends"
            className="block text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline"
          >
            👥 친구 페이지로 이동
          </Link>
          <Link
            to="/login"
            className="block text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline"
          >
            🔐 로그인 페이지로 이동
          </Link>
          <Link
            to="/profile"
            className="block text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline"
          >
            👤 프로필 페이지로 이동
          </Link>
          <Link
            to="/reviews"
            className="block text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline"
          >
            ⭐ 리뷰 페이지로 이동
          </Link>
        </div>
      </div>

      {/* Design Tokens Demo */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">🎨 디자인 시스템</h3>
        <DesignTokensDemo />
      </div>
    </div>
  );
};

export default Home;

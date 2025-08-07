import { Routes, Route, Outlet } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import { AuthWrapper } from '@/components/wrapper';
import Home from '@/pages/index';
import NotFound from '@/pages/notfound/index';
import Reviews from '@/pages/reviews';
import Friends from '@/pages/friends';
import Profile from '@/pages/profile';
import ProfileEdit from '@/pages/profile/edit';
import Signup from '@/pages/signup';
import Login from '@/pages/login';
import OAuthCallback from '@/components/auth/OAuthCallback';
import TestPage from '@/pages/test';
import TrailVisualizationTest from '@/pages/test/trail-visualization';
import BottomSheetTestPage from '@/pages/test/bottom-sheet';
import ShadcnDialogTestPage from '@/pages/test/shadcn-dialog';
import GPSTestPage from '@/pages/test/gps-test';
import TrailProgressTest from '@/pages/test/trail-progress';
import SimpleMapTest from '@/pages/test/simple-map';
import CategorySearchTest from '@/pages/test/category-search';
import WalkApiTest from '@/pages/test/walk-api-test';
import WalkZustandTest from '@/pages/test/walk-zustand-test';
import WalkIntegrationTest from '@/pages/test/walk-integration-test';
import WalkSimpleTest from '@/pages/test/walk-simple-test';
import WalkFullTest from '@/pages/test/walk-full-test';
import WalkHistoryPage from '@/pages/walk-history';

import '@/App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* OAuth 콜백 처리 - RootLayout 밖에 배치 */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* 현재 RootLayout 은 전역에 적용되는 레이아웃 입니다. 근데 /test 랑 /test/trail~ 는 어떤 방식으로 만들었는지 몰라서 밖으로 뺐습니다.
        유저 인증이 있어야 작동해야 되는 페이지는 AuthWrapper 안으로 이동시켜서 하시면 됩니다. */}

        {/* 테스트 페이지 - src/pages/test/index.tsx */}
        <Route path="/test" element={<TestPage />} />

        {/* 산책 경로 시각화 테스트 페이지 */}
        <Route
          path="/test/trail-visualization"
          element={<TrailVisualizationTest />}
        />

        {/* BottomSheet 테스트 페이지 */}
        <Route path="/test/bottom-sheet" element={<BottomSheetTestPage />} />

        {/* shadcn/ui Dialog 테스트 페이지 */}
        <Route path="/test/shadcn-dialog" element={<ShadcnDialogTestPage />} />

        {/* GPS 테스트 페이지 */}
        <Route path="/test/gps" element={<GPSTestPage />} />

        {/* 산책 경로 진행률 추적 테스트 페이지 */}
        <Route path="/test/trail-progress" element={<TrailProgressTest />} />

        {/* 카카오맵 단순 테스트 페이지 */}
        <Route path="/test/simple-map" element={<SimpleMapTest />} />

        {/* 카테고리별 장소 검색 테스트 페이지 */}
        <Route path="/test/category-search" element={<CategorySearchTest />} />

        {/* 산책 API 테스트 페이지 */}
        <Route path="/test/walk-api" element={<WalkApiTest />} />

        {/* 산책 Zustand 스토어 테스트 페이지 */}
        <Route path="/test/walk-zustand" element={<WalkZustandTest />} />

        {/* 산책 통합 테스트 페이지 (GPS + 지도) */}
        <Route
          path="/test/walk-integration"
          element={<WalkIntegrationTest />}
        />

        {/* 산책 간단 테스트 페이지 (지도 없음) */}
        <Route path="/test/walk-simple" element={<WalkSimpleTest />} />

        {/* 산책 통합 테스트 페이지 (GPS + 지도 + API) */}
        <Route path="/test/walk-full" element={<WalkFullTest />} />



        {/* 홈 페이지 - RootLayout 없이 단독 렌더링 (Footer 없음) */}
        <Route 
          path="/" 
          element={
            <AuthWrapper requireAuth={true}>
              <Home />
            </AuthWrapper>
          } 
        />

        {/* 모든 페이지에 RootLayout 적용 */}
        <Route element={<RootLayout />}>
          {/* 공개 경로들 (인증 불필요) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* 인증이 필요한 경로들 */}
          <Route path="/walk-history" element={
            <AuthWrapper requireAuth={true}>
              <WalkHistoryPage />
            </AuthWrapper>
          } />

          {/* 보호된 경로들 (인증 필요) */}
          <Route
            element={
              <AuthWrapper requireAuth={true}>
                <Outlet />
              </AuthWrapper>
            }
          >

            {/* 리뷰 페이지 - src/pages/reviews/index.tsx */}
            <Route path="/reviews" element={<Reviews />} />

            {/* 친구 페이지 - src/pages/friends/index.tsx */}
            <Route path="/friends" element={<Friends />} />

            {/* 프로필 페이지 - src/pages/profile/index.tsx */}
            <Route path="/profile" element={<Profile />} />

            {/* 프로필 수정 페이지 - src/pages/profile/edit/index.tsx */}
            <Route path="/profile/edit" element={<ProfileEdit />} />

            {/* 404 페이지 - src/pages/notfound/index.tsx */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;

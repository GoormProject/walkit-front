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
import TestPage from '@/pages/test';
import TrailVisualizationTest from '@/pages/test/trail-visualization';
import '@/App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 현재 RootLayout 은 전역에 적용되는 레이아웃 입니다. 근데 /test 랑 /test/trail~ 는 어떤 방식으로 만들었는지 몰라서 밖으로 뺐습니다.
        유저 인증이 있어야 작동해야 되는 페이지는 AuthWrapper 안으로 이동시켜서 하시면 됩니다. */}

        {/* 테스트 페이지 - src/pages/test/index.tsx */}
        <Route path="/test" element={<TestPage />} />

        {/* 산책 경로 시각화 테스트 페이지 */}
        <Route
          path="/test/trail-visualization"
          element={<TrailVisualizationTest />}
        />

        {/* 모든 페이지에 RootLayout 적용 */}
        <Route element={<RootLayout />}>
          {/* 공개 경로들 (인증 불필요) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 보호된 경로들 (인증 필요) */}
          <Route
            element={
              <AuthWrapper requireAuth={true}>
                <Outlet />
              </AuthWrapper>
            }
          >
            {/* 홈 페이지 - src/pages/index.tsx */}
            <Route path="/" element={<Home />} />

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

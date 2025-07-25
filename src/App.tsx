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

import '@/App.css';

function App() {
  return (
    <div className="App">
      <Routes>
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

import { Routes, Route } from 'react-router-dom'
import Home from './pages/index'
import NotFound from './pages/notfound/index'
import Reviews from './pages/reviews'
import Friends from './pages/friends'
import Profile from './pages/profile'
import ProfileEdit from './pages/profile/edit'
import Signup from './pages/signup'
import Login from './pages/login'
import TestPage from './pages/test'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
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
        
        {/* 회원가입 페이지 - src/pages/signup/index.tsx */}
        <Route path="/signup" element={<Signup />} />
        
        {/* 로그인 페이지 - src/pages/login/index.tsx */}
        <Route path="/login" element={<Login />} />
        
        {/* 테스트 페이지 - src/pages/test/index.tsx */}
        <Route path="/test" element={<TestPage />} />
        
        {/* 404 페이지 - src/pages/notfound/index.tsx */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App

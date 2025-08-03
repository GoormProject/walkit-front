import { Link } from 'react-router-dom'
import { useAuthActions } from '@/features/auth/authSlice'
import { logoutUser } from '@/utils/logout'
import { toast } from 'sonner'

const Profile = () => {
  const { logout } = useAuthActions()

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      console.log('🚪 로그아웃 버튼 클릭됨')

      // API 로그아웃 호출
      const success = await logoutUser()
      
      if (success) {
        console.log('✅ API 로그아웃 성공')
        logout()
        toast.success('로그아웃되었습니다.')
      } else {
        console.log('❌ API 로그아웃 실패')
        // API 로그아웃이 실패해도 클라이언트 상태는 로그아웃 처리
        logout()
        toast.success('로그아웃되었습니다.')
      }
    } catch (error) {
      console.error('🚨 로그아웃 중 오류:', error)
      // 오류가 발생해도 클라이언트 상태는 로그아웃 처리
      logout()
      toast.success('로그아웃되었습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6">프로필</h1>
        <p className="text-lg mb-4">내 프로필을 확인해보세요!</p>
        <Link 
          to="/" 
          className="text-blue-600 hover:text-blue-800 underline">
          홈으로 돌아가기
        </Link>
        <br></br>
        <Link 
          to="/profile/edit" 
          className="text-blue-600 hover:text-blue-800 underline">
          /profile/edit 으로가기 (내 프로필 수정)
        </Link>
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto flex justify-around items-center">
          <Link
            to="/profile"
            className="flex flex-col items-center text-blue-600 hover:text-blue-800"
          >
            <span className="material-icons mb-1">person</span>
            <span className="text-sm">프로필</span>
          </Link>
          <Link
            to="/friends"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <span className="material-icons mb-1">group</span>
            <span className="text-sm">친구</span>
          </Link>
          <Link
            to="/reviews"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <span className="material-icons mb-1">star</span>
            <span className="text-sm">리뷰</span>
          </Link>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-all text-lg font-semibold"
          >
            로그아웃
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Profile

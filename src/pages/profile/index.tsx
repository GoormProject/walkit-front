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
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">프로필</h1>
      <p className="text-lg mb-4">내 프로필을 확인해보세요!</p>
      
      <div className="space-y-4">
        <Link 
          to="/" 
          className="block text-blue-600 hover:text-blue-800 underline">
          홈으로 돌아가기
        </Link>
        
        <Link 
          to="/profile/edit" 
          className="block text-blue-600 hover:text-blue-800 underline">
          /profile/edit 으로가기 (내 프로필 수정)
        </Link>
        
        <Link 
          to="/friends" 
          className="block text-blue-600 hover:text-blue-800 underline">
          친구 페이지로 가기
        </Link>
        
        <Link 
          to="/reviews" 
          className="block text-blue-600 hover:text-blue-800 underline">
          리뷰 페이지로 가기
        </Link>
        
        <button
          onClick={handleLogout}
          className="block px-8 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-all text-lg font-semibold"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default Profile

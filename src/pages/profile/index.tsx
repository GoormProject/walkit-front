import { Link } from 'react-router-dom'

const Profile = () => {
  return (
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
  )
}

export default Profile

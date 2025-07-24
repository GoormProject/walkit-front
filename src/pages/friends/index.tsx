import { Link } from 'react-router-dom'

const Friends = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">친구</h1>
      <p className="text-lg mb-4">함께 산책할 친구를 찾아보세요!</p>
      <Link 
        to="/" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default Friends

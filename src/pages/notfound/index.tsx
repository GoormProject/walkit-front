import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="text-lg mb-6">요청하신 페이지가 존재하지 않습니다.</p>
      <Link 
        to="/" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default NotFound 
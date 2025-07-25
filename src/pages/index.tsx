import { Link } from 'react-router-dom'
import DesignTokensDemo from '../components/DesignTokensDemo'

const Home = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Walkit 홈</h1>
      <p className="text-lg mb-4">산책 앱에 오신 것을 환영합니다!</p>
      <Link 
        to="/friends" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        friends 페이지로 이동
      </Link>
      <br></br>
      <Link 
        to="/login" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        login 페이지로 이동
      </Link>
      <br></br>
      <Link 
        to="/profile" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        profile 페이지로 이동
      </Link>
      <br></br>
      <Link 
        to="/reviews" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        reviews 페이지로 이동
      </Link>
      
      <br></br>
    </div>
  )
}

export default Home 

import { Link } from 'react-router-dom'
import DesignTokensDemo from '../components/DesignTokensDemo'

const Home = () => {
  return (
    <div className="container mx-auto">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6 text-text-primary">Walkit 홈</h1>
        <p className="text-lg mb-4 text-text-secondary">산책 앱에 오신 것을 환영합니다!</p>
        <Link 
          to="/about" 
          className="text-primary-600 hover:text-primary-800 underline"
        >
          About 페이지로 이동
        </Link>
      </div>
      
      {/* Design Tokens Demo */}
      <DesignTokensDemo />
    </div>
  )
}

export default Home 

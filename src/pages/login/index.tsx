import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">로그인</h1>
      <p className="text-lg mb-4">Walkit에 로그인해보세요!</p>
      <Link 
        to="/" 
        className="text-blue-600 hover:text-blue-800 underline">
        홈으로 돌아가기
      </Link>
      <br></br>
      <Link 
        to="/signup" 
        className="text-blue-600 hover:text-blue-800 underline">
        회원가입 하러가기
      </Link>
    </div>
  )
}

export default Login

import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">회원가입</h1>
      <p className="text-lg mb-4">Walkit에 가입해보세요!</p>
      <Link 
        to="/login" 
        className="text-blue-600 hover:text-blue-800 underline">
        로그인 하러가기
      </Link>
    </div>
  )
}

export default Signup

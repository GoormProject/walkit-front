import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">About Walkit</h1>
      <p className="text-lg mb-4">Walkit은 산책을 더 즐겁게 만들어주는 앱입니다.</p>
      <Link 
        to="/" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default About 
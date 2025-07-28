import { Link } from 'react-router-dom';
import { GoogleSignupButton, KakaoSignupButton } from '@/components/ui';

interface SignupProps {
  buttonSpacing?: number; // rem 단위로 간격 조절
}

const Signup: React.FC<SignupProps> = ({ buttonSpacing = 2 }) => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">회원가입</h1>
      <p className="text-lg mb-4">Walkit에 가입해보세요!</p>

      <Link
        to="/login"
        className="text-blue-600 hover:text-blue-800 underline mb-6 block"
      >
        로그인 하러가기
      </Link>

      <div
        style={{ gap: `${buttonSpacing}rem` }}
        className="flex flex-col items-center"
      >
        <GoogleSignupButton />
        <KakaoSignupButton />
      </div>
    </div>
  );
};

export default Signup;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Api } from '@/api/swagger-api';
import { useAuth } from '@/features/auth/authSlice';

interface ProfileData {
  name?: string;
  nickname?: string;
  email?: string;
  profile?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.memberId) {
        setError('사용자 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        if (import.meta.env.DEV) {
          console.log('🔍 프로필 조회 시작');
          console.log('👤 memberId:', user.memberId);
        }

        const api = new Api({
          baseURL: import.meta.env.VITE_API_BASE_URL,
          withCredentials: true,
        });

        const response = await api.api.getProfile(parseInt(user.memberId));

        if (import.meta.env.DEV) {
          console.log('✅ 프로필 조회 성공:', response.data);
        }

        if (response.data?.data) {
          if (import.meta.env.DEV) {
            console.log(
              '🔍 백엔드에서 받은 프로필 데이터:',
              response.data.data
            );
            console.log('📝 name:', response.data.data.name);
            console.log('📝 nickname:', response.data.data.nickname);
            console.log('📧 email:', response.data.data.email);
          }
          setProfile(response.data.data);
        } else {
          setError('프로필 정보를 가져올 수 없습니다.');
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('❌ 프로필 조회 실패:', err);
        }
        setError('프로필 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.memberId]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">프로필 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">오류!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold mb-2">프로필</h1>
          <p className="text-blue-100">내 프로필 정보를 확인해보세요</p>
        </div>

        {/* 프로필 이미지 */}
        <div className="px-6 py-8 text-center">
          <div className="inline-block relative">
            <img
              src={profile?.profile || '/test_picture/fail_to_loading.jpg'}
              alt="프로필 이미지"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              onError={e => {
                e.currentTarget.src = '/test_picture/fail_to_loading.jpg';
              }}
            />
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="px-6 pb-8">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                이름
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.name || '이름 없음'}
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                닉네임
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.nickname || '닉네임 없음'}
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                이메일
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.email || '이메일 없음'}
              </p>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/profile/edit"
              className={`flex-1 font-semibold py-3 px-6 rounded-lg text-center transition-colors ${
                user?.memberId && profile
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
              onClick={e => {
                if (!user?.memberId || !profile) {
                  e.preventDefault();
                }
              }}
            >
              {user?.memberId && profile
                ? '프로필 수정'
                : '프로필 수정 (비활성화)'}
            </Link>
            <Link
              to="/walk-history"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              내 산책 기록
            </Link>
            <Link
              to="/"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

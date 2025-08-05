import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Api } from '@/api/swagger-api';
import { useAuth } from '@/features/auth/authSlice';

interface ProfileData {
  name?: string;
  nickname?: string;
  email?: string;
  profile?: string;
}

const ProfileEdit = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.memberId) {
        setError('사용자 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 프로필 조회 시작');
        console.log('👤 memberId:', user.memberId);

        const api = new Api({
          baseURL: import.meta.env.VITE_API_BASE_URL,
          withCredentials: true,
        });

        const response = await api.api.getProfile(parseInt(user.memberId));
        console.log('✅ 프로필 조회 성공:', response.data);

        if (response.data?.data) {
          const profileData = response.data.data;
          setProfile(profileData);
          setFormData({
            name: profileData.name || '',
            nickname: profileData.nickname || '',
          });
          setPreviewImage(profileData.profile || null);
        } else {
          setError('프로필 정보를 가져올 수 없습니다.');
        }
      } catch (err) {
        console.error('❌ 프로필 조회 실패:', err);
        setError('프로필 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.memberId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (1MB = 1024 * 1024 bytes)
      const maxSize = 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        setError('이미지 크기는 1MB 이하여야 합니다.');
        e.target.value = ''; // 파일 선택 초기화
        return;
      }

      // 파일 타입 검증 (GIF 제외)
      if (!file.type.startsWith('image/') || file.type === 'image/gif') {
        setError(
          'JPG, PNG 이미지 파일만 업로드 가능합니다. (GIF는 지원하지 않습니다)'
        );
        e.target.value = '';
        return;
      }

      setProfileImage(file);
      setError(null); // 이전 에러 메시지 제거

      // 파일 크기 표시
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeInMB}MB`);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.memberId) {
      setError('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔄 프로필 수정 시작');
      console.log('📝 폼 데이터:', formData);
      console.log('🖼️ 이미지:', profileImage);

      const api = new Api({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
      });

      console.log('📤 전송할 데이터 구조:', {
        data: formData,
        profileImage: profileImage ? 'File exists' : 'No file',
      });

      // FormData 객체를 직접 구성하여 전송
      const multipartFormData = new FormData();

      // JSON 데이터를 Blob으로 변환하여 추가
      multipartFormData.append(
        'data',
        new Blob([JSON.stringify(formData)], { type: 'application/json' })
      );

      // 이미지 파일 추가
      if (profileImage) {
        multipartFormData.append('profileImage', profileImage);
      }

      const response = await api.api.updateProfile(
        parseInt(user.memberId),
        multipartFormData as any
      );

      console.log('✅ 프로필 수정 성공:', response.data);
      setSuccess('프로필이 성공적으로 수정되었습니다!');

      // 3초 후 프로필 페이지로 이동
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (err: unknown) {
      console.error('❌ 프로필 수정 실패:', err);
      console.error('🚨 에러 상세 정보:', {
        message: (err as any)?.message,
        status: (err as any)?.response?.status,
        statusText: (err as any)?.response?.statusText,
        data: (err as any)?.response?.data,
        dataString: JSON.stringify((err as any)?.response?.data),
        config: (err as any)?.config,
      });
      setError('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold mb-2">프로필 수정</h1>
          <p className="text-green-100">프로필 정보를 수정해보세요</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="px-6 py-8">
          {/* 프로필 이미지 */}
          <div className="mb-6 text-center">
            <div className="inline-block relative">
              <img
                src={previewImage || '/test_picture/fail_to_loading.jpg'}
                alt="프로필 이미지"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={e => {
                  e.currentTarget.src = '/test_picture/fail_to_loading.jpg';
                }}
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                📷
              </label>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-500">
                이미지를 클릭하여 변경할 수 있습니다
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 font-medium mb-1">
                  📋 이미지 업로드 제한사항
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 파일 형식: JPG, PNG 이미지 파일</li>
                  <li>• 최대 크기: 1MB</li>
                  <li>• 개수: 1개 파일만 업로드 가능</li>
                  <li>• GIF는 지원하지 않습니다</li>
                </ul>
                {fileSize && (
                  <p className="text-xs text-green-700 mt-2 font-medium">
                    📁 선택된 파일 크기: {fileSize}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">오류!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {/* 성공 메시지 */}
          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <strong className="font-bold">성공!</strong>
              <span className="block sm:inline"> {success}</span>
            </div>
          )}

          {/* 이름 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              maxLength={20}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이름을 입력하세요"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.name.length}/20자
            </p>
          </div>

          {/* 닉네임 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              닉네임 *
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              maxLength={20}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="닉네임을 입력하세요"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.nickname.length}/20자
            </p>
          </div>

          {/* 이메일 표시 (수정 불가) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              이메일은 수정할 수 없습니다
            </p>
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {saving ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  저장 중...
                </span>
              ) : (
                '프로필 저장'
              )}
            </button>
            <Link
              to="/profile"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;

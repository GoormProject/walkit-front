import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWalkDetail } from '../../utils/walkApi';
import { registerTrail } from '../../utils/trailApi';
import { formatDistance } from '../../utils/walkUtils';
import type { WalkDetail } from '../../types/walk';
import type { TrailRegisterRequest } from '../../types/trail';

const TrailRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { walkId } = useParams<{ walkId: string }>();
  const [walk, setWalk] = useState<WalkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  // 이미지 업로드 상태
  const [routeImage, setRouteImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  // 산책 기록 상세 정보 로드
  useEffect(() => {
    const loadWalkDetail = async () => {
      if (!walkId) {
        setError('산책 기록 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await getWalkDetail(parseInt(walkId, 10));
        
        if (response.data) {
          setWalk(response.data);
          setTitle(response.data.title || '');
          
          // 기본 이미지 설정 (DB에 저장된 이미지가 있으면 사용)
          if (response.data.routeImageUrl) {
            setPreviewImage(response.data.routeImageUrl);
          }
          
          // 기본 위치 설정 (임시)
          setLocation('서울시 강남구');
        }
      } catch (err) {
        console.error('산책 기록 상세 조회 실패:', err);
        setError('산책 기록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadWalkDetail();
  }, [walkId]);

  // 이미지 업로드 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('이미지 크기는 5MB 이하여야 합니다.');
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

      setRouteImage(file);
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

  // 산책로 등록 처리
  const handleSubmit = async () => {
    if (!walk || !title.trim() || !description.trim()) {
      setError('제목과 설명을 모두 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // FormData 객체를 사용하여 이미지와 함께 전송
      const formData = new FormData();
      
      // JSON 데이터를 Blob으로 변환하여 추가
      const requestData = {
        walkId: walk.walkId,
        title: title.trim(),
        description: description.trim(),
        location: location,
        length: walk.totalDistance / 1000, // m를 km로 변환
        routeImageUrl: walk.routeImageUrl || '',
        pathId: walk.walkId, // 임시로 walkId 사용
        startPoint: walk.startPoint,
        path: walk.path,
        isUploaded: false,
      };
      
      formData.append(
        'data',
        new Blob([JSON.stringify(requestData)], { type: 'application/json' })
      );

      // 이미지 파일 추가
      if (routeImage) {
        formData.append('routeImage', routeImage);
      }

      const response = await registerTrail(formData as any);
      
      if (response.httpStatus === 200) {
        alert('산책로가 성공적으로 등록되었습니다!');
        navigate('/walk-history');
      } else {
        setError(response.message || '산책로 등록에 실패했습니다.');
      }
    } catch (err) {
      console.error('산책로 등록 실패:', err);
      setError('산책로 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">산책 기록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !walk) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '산책 기록을 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/walk-history')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">내 산책로 공유하기</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 산책로 제목 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="산책로 이름을 입력하세요"
              className="flex-1 text-lg font-medium text-gray-900 border-none outline-none bg-transparent"
              maxLength={50}
            />
          </div>
        </div>

        {/* 산책로 이미지 업로드 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <div className="inline-block relative">
              <img
                src={previewImage || '/test_picture/fail_to_loading.jpg'}
                alt="산책로 이미지"
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                onError={e => {
                  e.currentTarget.src = '/test_picture/fail_to_loading.jpg';
                }}
              />
              <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                📷
              </label>
            </div>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-600">
                산책로를 대표할 이미지를 업로드해주세요
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 font-medium mb-1">
                  📋 이미지 업로드 제한사항
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 파일 형식: JPG, PNG 이미지 파일</li>
                  <li>• 최대 크기: 5MB</li>
                  <li>• 개수: 1개 파일만 업로드 가능</li>
                  <li>• GIF는 지원하지 않습니다</li>
                </ul>
                {fileSize && (
                  <p className="text-xs text-green-700 mt-2 font-medium">
                    📁 선택된 파일 크기: {fileSize}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500">
                총 거리: {formatDistance(walk.totalDistance)}
              </p>
            </div>
          </div>
        </div>

        {/* 설명 입력 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="다른 유저들이 참고할 수 있도록 산책로 설명을 남겨주세요."
            className="w-full h-32 resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">설명 작성 시 주의사항</p>
            <span className="text-xs text-gray-500">{description.length}/100</span>
          </div>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 공유하기 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim() || !description.trim()}
          className="w-full bg-green-500 text-white py-4 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '등록 중...' : '공유하기'}
        </button>
      </div>
    </div>
  );
};

export default TrailRegisterPage; 

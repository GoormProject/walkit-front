import React, { useEffect } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useWalkApi } from '../../hooks/useWalkApi';
import type { WalkCreateRequest } from '../../types/walk';

const WalkZustandTest: React.FC = () => {
  const {
    walk,
    startWalk,
    pauseWalk,
    resumeWalk,
    endWalk,
    createWalk,
    fetchWalkList,
    deleteWalk,
    updatePath,
    clearError,
  } = useWalkApi();

  // 컴포넌트 마운트 시 산책 목록 조회
  useEffect(() => {
    fetchWalkList().catch(console.error);
  }, [fetchWalkList]);

  const handleStartWalk = async () => {
    try {
      await startWalk();
      console.log('산책 시작됨:', walk.currentWalk);
    } catch (error) {
      console.error('산책 시작 실패:', error);
    }
  };

  const handlePauseWalk = async () => {
    try {
      await pauseWalk();
      console.log('산책 일시정지됨');
    } catch (error) {
      console.error('산책 일시정지 실패:', error);
    }
  };

  const handleResumeWalk = async () => {
    try {
      await resumeWalk();
      console.log('산책 재개됨');
    } catch (error) {
      console.error('산책 재개 실패:', error);
    }
  };

  const handleEndWalk = async () => {
    try {
      await endWalk();
      console.log('산책 종료됨');
    } catch (error) {
      console.error('산책 종료 실패:', error);
    }
  };

  const handleCreateWalk = async () => {
    if (!walk.currentWalk.walkId || !walk.currentWalk.eventId) {
      console.error('먼저 산책을 시작하고 종료해주세요.');
      return;
    }

    const walkData: WalkCreateRequest = {
      walkId: walk.currentWalk.walkId,
      walkTitle: '2025-07-28의 산책기록',
      totalTime: 3600,
      totalDistance: 5635.2534,
      pace: 5.636,
      path: walk.currentWalk.path.length > 0 ? walk.currentWalk.path : [
        [126.75791835403612, 37.662510637017874],
        [126.75790151956403, 37.66262761454681],
        [126.75789029658108, 37.662723861742975],
      ],
      startPoint: walk.currentWalk.path.length > 0 ? walk.currentWalk.path[0] : [126.75791835403612, 37.662510637017874],
      eventId: walk.currentWalk.eventId,
      eventType: 'END',
      routeUrl: 'https://example.com/route-image.jpg',
    };

    try {
      await createWalk(walkData);
      console.log('산책 기록 등록됨');
    } catch (error) {
      console.error('산책 기록 등록 실패:', error);
    }
  };

  const handleDeleteWalk = async (walkId: number) => {
    try {
      await deleteWalk(walkId);
      console.log('산책 기록 삭제됨');
    } catch (error) {
      console.error('산책 기록 삭제 실패:', error);
    }
  };

  const handleUpdatePath = () => {
    const newPath = [
      [126.75791835403612, 37.662510637017874],
      [126.75790151956403, 37.66262761454681],
      [126.75789029658108, 37.662723861742975],
      [126.75790900155192, 37.66283343532169],
      [126.75795763447428, 37.662935605134706],
    ];
    updatePath(newPath);
    console.log('경로 업데이트됨:', newPath);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">산책 Zustand 스토어 테스트</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 현재 상태 표시 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">현재 상태</h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <h3 className="font-semibold text-blue-800">현재 산책</h3>
              <p>Walk ID: {walk.currentWalk.walkId || '없음'}</p>
              <p>Event ID: {walk.currentWalk.eventId || '없음'}</p>
              <p>상태: {walk.currentWalk.status}</p>
              <p>시작 시간: {walk.currentWalk.startTime ? new Date(walk.currentWalk.startTime).toLocaleString() : '없음'}</p>
              <p>경로 포인트: {walk.currentWalk.path.length}개</p>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-800">로딩/에러</h3>
              <p>로딩: {walk.loading ? '🔄' : '✅'}</p>
              <p>에러: {walk.error || '없음'}</p>
            </div>

            <div className="p-3 bg-green-50 rounded">
              <h3 className="font-semibold text-green-800">산책 목록</h3>
              <p>총 {walk.walkList.length}개</p>
            </div>
          </div>
        </Card>

        {/* API 테스트 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">API 테스트</h2>
          
          <div className="space-y-3">
            <Button
              onClick={handleStartWalk}
              disabled={walk.loading || walk.currentWalk.status !== 'idle'}
              className="w-full"
            >
              🚶‍♂️ 산책 시작
            </Button>
            
            <Button
              onClick={handlePauseWalk}
              disabled={walk.loading || walk.currentWalk.status !== 'walking'}
              className="w-full"
            >
              ⏸️ 일시정지
            </Button>
            
            <Button
              onClick={handleResumeWalk}
              disabled={walk.loading || walk.currentWalk.status !== 'paused'}
              className="w-full"
            >
              ▶️ 재개
            </Button>
            
            <Button
              onClick={handleEndWalk}
              disabled={walk.loading || !['walking', 'paused'].includes(walk.currentWalk.status)}
              className="w-full"
            >
              🏁 종료
            </Button>
            
            <Button
              onClick={handleCreateWalk}
              disabled={walk.loading || walk.currentWalk.status !== 'completed'}
              className="w-full"
            >
              💾 기록 등록
            </Button>
            
            <Button
              onClick={handleUpdatePath}
              disabled={walk.loading || walk.currentWalk.status === 'idle'}
              className="w-full"
            >
              🗺️ 경로 업데이트
            </Button>
            
            <Button
              onClick={() => fetchWalkList()}
              disabled={walk.loading}
              className="w-full"
            >
              📋 목록 새로고침
            </Button>

            {walk.error && (
              <Button
                onClick={clearError}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                ❌ 에러 초기화
              </Button>
            )}
          </div>
        </Card>

        {/* 상태 정보 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">상태 정보</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">현재 경로:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(walk.currentWalk.path, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">전체 상태:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(walk, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      </div>

      {/* 산책 목록 */}
      {walk.walkList.length > 0 && (
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">산책 기록 목록</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {walk.walkList.map((walkRecord) => (
              <div key={walkRecord.walkId} className="border p-4 rounded">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{walkRecord.title}</h3>
                  <Button
                    onClick={() => handleDeleteWalk(walkRecord.walkId)}
                    disabled={walk.loading}
                    className="text-red-600 hover:text-red-800"
                    variant="ghost"
                    size="sm"
                  >
                    🗑️
                  </Button>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p>거리: {walkRecord.totalDistance.toFixed(2)}m</p>
                  <p>시간: {formatDuration(walkRecord.totalTime)}</p>
                  <p>페이스: {walkRecord.pace.toFixed(2)}</p>
                  <p>종료: {new Date(walkRecord.eventTime).toLocaleString()}</p>
                  <p>업로드: {walkRecord.isUploaded ? '✅' : '❌'}</p>
                  {walkRecord.trailId && <p>산책로 ID: {walkRecord.trailId}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WalkZustandTest; 

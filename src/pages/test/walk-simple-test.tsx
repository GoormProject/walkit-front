import React, { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useWalkApi } from '../../hooks/useWalkApi';
import type { WalkCreateRequest } from '../../types/walk';
import { toast } from 'sonner';

const WalkSimpleTest: React.FC = () => {
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

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pathHistory, setPathHistory] = useState<number[][]>([]);
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);
  const [startTimeRef, setStartTimeRef] = useState<number | null>(null);

  // 컴포넌트 마운트 시 산책 목록 조회
  useEffect(() => {
    fetchWalkList().catch(console.error);
  }, [fetchWalkList]);

  // 타이머 관리
  useEffect(() => {
    if (isRecording && walk.currentWalk.status === 'walking') {
      if (!startTimeRef) {
        const now = Date.now();
        setStartTimeRef(now);
      }
      
      const interval = setInterval(() => {
        if (startTimeRef) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef) / 1000));
        }
      }, 1000);
      
      setIntervalRef(interval);
    } else {
      if (intervalRef) {
        clearInterval(intervalRef);
        setIntervalRef(null);
      }
      if (walk.currentWalk.status === 'completed') {
        setStartTimeRef(null);
      }
    }

    return () => {
      if (intervalRef) {
        clearInterval(intervalRef);
      }
    };
  }, [isRecording, walk.currentWalk.status]);

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 산책 시작
  const handleStartWalk = async () => {
    try {
      setIsRecording(true);
      setPathHistory([]);
      setDistance(0);
      setElapsedTime(0);
      
      await startWalk();
      toast.success('산책을 시작했습니다!');
    } catch (error) {
      console.error('산책 시작 실패:', error);
      setIsRecording(false);
      toast.error('산책 시작에 실패했습니다.');
    }
  };

  // 산책 일시정지
  const handlePauseWalk = async () => {
    try {
      setIsRecording(false);
      await pauseWalk();
      toast.success('산책을 일시정지했습니다.');
    } catch (error) {
      console.error('산책 일시정지 실패:', error);
      toast.error('산책 일시정지에 실패했습니다.');
    }
  };

  // 산책 재개
  const handleResumeWalk = async () => {
    try {
      setIsRecording(true);
      await resumeWalk();
      toast.success('산책을 재개했습니다.');
    } catch (error) {
      console.error('산책 재개 실패:', error);
      toast.error('산책 재개에 실패했습니다.');
    }
  };

  // 산책 종료
  const handleEndWalk = async () => {
    try {
      setIsRecording(false);
      await endWalk();
      toast.success('산책을 종료했습니다.');
    } catch (error) {
      console.error('산책 종료 실패:', error);
      toast.error('산책 종료에 실패했습니다.');
    }
  };

  // 산책 기록 등록
  const handleCreateWalk = async () => {
    if (!walk.currentWalk.walkId || !walk.currentWalk.eventId) {
      toast.error('먼저 산책을 시작하고 종료해주세요.');
      return;
    }

    const walkData: WalkCreateRequest = {
      walkId: walk.currentWalk.walkId,
      walkTitle: `${new Date().toLocaleDateString()}의 산책기록`,
      totalTime: elapsedTime,
      totalDistance: distance,
      pace: distance > 0 ? elapsedTime / (distance / 1000) : 0, // 초/km
      path: pathHistory.length > 0 ? pathHistory : [[126.75791835403612, 37.662510637017874]],
      startPoint: pathHistory.length > 0 ? pathHistory[0] : [126.75791835403612, 37.662510637017874],
      eventId: walk.currentWalk.eventId,
      eventType: 'END',
      routeUrl: 'https://example.com/route-image.jpg',
    };

    try {
      await createWalk(walkData);
      toast.success('산책 기록이 등록되었습니다!');
    } catch (error) {
      console.error('산책 기록 등록 실패:', error);
      toast.error('산책 기록 등록에 실패했습니다.');
    }
  };

  // 산책 기록 삭제
  const handleDeleteWalk = async (walkId: number) => {
    try {
      await deleteWalk(walkId);
      toast.success('산책 기록이 삭제되었습니다.');
    } catch (error) {
      console.error('산책 기록 삭제 실패:', error);
      toast.error('산책 기록 삭제에 실패했습니다.');
    }
  };

  // 경로 업데이트 (시뮬레이션)
  const handleUpdatePath = () => {
    const newPoint = [
      126.75791835403612 + Math.random() * 0.001,
      37.662510637017874 + Math.random() * 0.001
    ];
    setPathHistory(prev => {
      const newPath = [...prev, newPoint];
      updatePath(newPath);
      return newPath;
    });
    
    // 거리 증가 (시뮬레이션)
    setDistance(prev => prev + Math.random() * 100);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">산책 간단 테스트 (지도 없음)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 현재 상태 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">현재 상태</h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <h3 className="font-semibold text-blue-800">산책 상태</h3>
              <p>상태: {walk.currentWalk.status}</p>
              <p>Walk ID: {walk.currentWalk.walkId || '없음'}</p>
              <p>경로 포인트: {pathHistory.length}개</p>
            </div>

            <div className="p-3 bg-green-50 rounded">
              <h3 className="font-semibold text-green-800">실시간 정보</h3>
              <p>시간: {formatTime(elapsedTime)}</p>
              <p>거리: {distance.toFixed(2)}m</p>
              <p>페이스: {distance > 0 ? (elapsedTime / (distance / 1000)).toFixed(2) : 0}초/km</p>
            </div>

            <div className="p-3 bg-yellow-50 rounded">
              <h3 className="font-semibold text-yellow-800">기록 상태</h3>
              <p>기록 중: {isRecording ? '✅' : '❌'}</p>
              <p>로딩: {walk.loading ? '🔄' : '✅'}</p>
              <p>에러: {walk.error || '없음'}</p>
            </div>
          </div>
        </Card>

        {/* 컨트롤 버튼 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">산책 컨트롤</h2>
          
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
              🗺️ 경로 시뮬레이션
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
                  <p>시간: {formatTime(walkRecord.totalTime)}</p>
                  <p>페이스: {walkRecord.pace.toFixed(2)}초/km</p>
                  <p>종료: {new Date(walkRecord.eventTime).toLocaleString()}</p>
                  <p>업로드: {walkRecord.isUploaded ? '✅' : '❌'}</p>
                  {walkRecord.trailId && <p>산책로 ID: {walkRecord.trailId}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 디버그 정보 */}
      <Card className="p-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">디버그 정보</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">현재 경로:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(pathHistory, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Zustand 상태:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(walk, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalkSimpleTest; 

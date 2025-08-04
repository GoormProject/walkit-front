import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
  startWalk,
  pauseWalk,
  resumeWalk,
  endWalk,
  createWalk,
  getWalkList,
  deleteWalk,
} from '../../utils/walkApi';
import type { WalkRecord, WalkCreateRequest } from '../../types/walk';

const WalkApiTest: React.FC = () => {
  const [currentWalkId, setCurrentWalkId] = useState<number | null>(null);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [walkList, setWalkList] = useState<WalkRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [path, setPath] = useState<number[][]>([
    [126.75791835403612, 37.662510637017874],
    [126.75790151956403, 37.66262761454681],
    [126.75789029658108, 37.662723861742975],
  ]);

  const handleApiCall = async (apiCall: () => Promise<any>, name: string) => {
    setLoading(true);
    setResult('');
    try {
      const response = await apiCall();
      setResult(`${name} 성공:\n${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`${name} 실패:\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWalk = () => {
    handleApiCall(async () => {
      const response = await startWalk();
      setCurrentWalkId(response.data.walkId);
      setCurrentEventId(response.data.eventId);
      return response;
    }, '산책 시작');
  };

  const handlePauseWalk = () => {
    if (!currentWalkId) {
      setResult('먼저 산책을 시작해주세요.');
      return;
    }
    handleApiCall(() => pauseWalk(currentWalkId), '산책 일시정지');
  };

  const handleResumeWalk = () => {
    if (!currentWalkId) {
      setResult('먼저 산책을 시작해주세요.');
      return;
    }
    handleApiCall(() => resumeWalk(currentWalkId), '산책 재개');
  };

  const handleEndWalk = () => {
    if (!currentWalkId) {
      setResult('먼저 산책을 시작해주세요.');
      return;
    }
    handleApiCall(() => endWalk(currentWalkId, path), '산책 종료');
  };

  const handleCreateWalk = () => {
    if (!currentWalkId || !currentEventId) {
      setResult('먼저 산책을 시작하고 종료해주세요.');
      return;
    }

    const walkData: WalkCreateRequest = {
      walkId: currentWalkId,
      walkTitle: '2025-07-28의 산책기록',
      totalTime: 3600,
      totalDistance: 5635.2534,
      pace: 5.636,
      path,
      startPoint: path[0],
      eventId: currentEventId,
      eventType: 'END',
      routeUrl: 'https://example.com/route-image.jpg',
    };

    handleApiCall(() => createWalk(walkData), '산책 기록 등록');
  };

  const handleGetWalkList = () => {
    handleApiCall(async () => {
      const response = await getWalkList();
      setWalkList(response.data);
      return response;
    }, '산책 기록 목록 조회');
  };

  const handleDeleteWalk = (walkId: number) => {
    handleApiCall(() => deleteWalk(walkId), `산책 기록 삭제 (ID: ${walkId})`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">산책 API 테스트</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API 테스트 섹션 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">API 테스트</h2>
          
          <div className="space-y-3">
            <Button
              onClick={handleStartWalk}
              disabled={loading}
              className="w-full"
            >
              🚶‍♂️ 산책 시작
            </Button>
            
            <Button
              onClick={handlePauseWalk}
              disabled={loading || !currentWalkId}
              className="w-full"
            >
              ⏸️ 일시정지
            </Button>
            
            <Button
              onClick={handleResumeWalk}
              disabled={loading || !currentWalkId}
              className="w-full"
            >
              ▶️ 재개
            </Button>
            
            <Button
              onClick={handleEndWalk}
              disabled={loading || !currentWalkId}
              className="w-full"
            >
              🏁 종료
            </Button>
            
            <Button
              onClick={handleCreateWalk}
              disabled={loading || !currentWalkId}
              className="w-full"
            >
              💾 기록 등록
            </Button>
            
            <Button
              onClick={handleGetWalkList}
              disabled={loading}
              className="w-full"
            >
              📋 목록 조회
            </Button>
          </div>

          <div className="mt-4 p-3 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">현재 상태:</h3>
            <p>Walk ID: {currentWalkId || '없음'}</p>
            <p>Event ID: {currentEventId || '없음'}</p>
          </div>
        </Card>

        {/* 결과 표시 섹션 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">API 응답 결과</h2>
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">API 호출 중...</p>
            </div>
          )}
          
          {result && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {result}
            </pre>
          )}
        </Card>
      </div>

      {/* 산책 목록 표시 */}
      {walkList.length > 0 && (
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">산책 기록 목록</h2>
          
          <div className="space-y-4">
            {walkList.map((walk) => (
              <div key={walk.walkId} className="border p-4 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{walk.title}</h3>
                    <p className="text-sm text-gray-600">
                      거리: {walk.totalDistance.toFixed(2)}m | 
                      시간: {Math.floor(walk.totalTime / 60)}분 | 
                      페이스: {walk.pace.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      종료: {new Date(walk.eventTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      업로드: {walk.isUploaded ? '✅' : '❌'}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleDeleteWalk(walk.walkId)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800"
                    variant="ghost"
                  >
                    🗑️ 삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WalkApiTest; 

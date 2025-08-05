import React from 'react';
import { useAuthentication } from '@/hooks/useAuthentication';

interface AuthenticationPanelProps {
  isLoading?: boolean;
}

export const AuthenticationPanel: React.FC<AuthenticationPanelProps> = ({ 
  isLoading = false 
}) => {
  const {
    isAuthenticated,
    handleGetCookieToken,
    handleShowAllCookies,
    handleShowOAuthLinks,
    handleSetToken,
    handleLogout,
    handleForceLogout,
    handleSetTestToken,
  } = useAuthentication();

  return (
    <div className="bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4">🔐 인증 관리</h2>
      
      {/* 인증 상태 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">인증 상태:</span>
          {isAuthenticated ? (
            <span className="text-green-600 text-sm">✅ 인증됨</span>
          ) : (
            <span className="text-red-600 text-sm">❌ 인증 필요</span>
          )}
        </div>
      </div>

      {/* 인증 버튼들 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <button
          onClick={handleGetCookieToken}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '쿠키 토큰 가져오기...' : '쿠키 토큰 가져오기'}
        </button>
        <button
          onClick={handleShowAllCookies}
          disabled={isLoading}
          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '모든 쿠키 보기...' : '모든 쿠키 보기'}
        </button>
        <button
          onClick={handleShowOAuthLinks}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'OAuth 링크 보기...' : 'OAuth 링크 보기'}
        </button>
        <button
          onClick={handleSetToken}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '토큰 설정...' : '토큰 설정'}
        </button>
        <button
          onClick={handleSetTestToken}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '테스트 토큰...' : '테스트 토큰'}
        </button>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '로그아웃...' : '로그아웃'}
        </button>
        <button
          onClick={handleForceLogout}
          disabled={isLoading}
          className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '강제 로그아웃...' : '강제 로그아웃'}
        </button>
      </div>
    </div>
  );
}; 

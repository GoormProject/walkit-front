import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { logoutUser, forceLogout } from '@/utils/logout';

export const useAuthentication = () => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
    
    // 쿠키에서 토큰 확인
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('ACCESS_TOKEN=')
    );
    
    if (accessTokenCookie) {
      const tokenValue = accessTokenCookie.split('=')[1];
      console.log('🍪 쿠키에서 발견된 ACCESS_TOKEN:', tokenValue);
      setAccessToken(tokenValue);
      setIsAuthenticated(true);
    }
  }, []);

  // 쿠키에서 토큰 가져오기
  const handleGetCookieToken = () => {
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('ACCESS_TOKEN=')
    );
    
    if (accessTokenCookie) {
      const tokenValue = accessTokenCookie.split('=')[1];
      setAccessToken(tokenValue);
      localStorage.setItem('accessToken', tokenValue);
      setIsAuthenticated(true);
      toast.success('쿠키에서 토큰을 가져왔습니다!');
    } else {
      toast.error('쿠키에서 ACCESS_TOKEN을 찾을 수 없습니다.');
    }
  };

  // 모든 쿠키 확인
  const handleShowAllCookies = () => {
    const cookies = document.cookie.split(';');
    console.log('🍪 모든 쿠키:', cookies);
    console.log('🍪 쿠키 개수:', cookies.length);
    console.log('🍪 document.cookie:', document.cookie);
    
    if (cookies.length === 0 || (cookies.length === 1 && cookies[0].trim() === '')) {
      toast.error('쿠키가 없습니다. 로그인이 필요합니다.');
      console.log('❌ 쿠키가 없습니다. OAuth 로그인을 먼저 수행해주세요.');
    } else {
      toast.success('콘솔에서 모든 쿠키를 확인하세요.');
      cookies.forEach((cookie, index) => {
        console.log(`🍪 쿠키 ${index + 1}:`, cookie.trim());
      });
    }
  };

  // OAuth 로그인 링크 생성
  const handleShowOAuthLinks = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const kakaoUrl = `${baseUrl}/oauth2/authorization/kakao`;
    const googleUrl = `${baseUrl}/oauth2/authorization/google`;
    
    console.log('🔗 OAuth 로그인 링크:');
    console.log('📱 카카오 로그인:', kakaoUrl);
    console.log('🔍 구글 로그인:', googleUrl);
    
    toast.info('콘솔에서 OAuth 로그인 링크를 확인하세요.');
  };

  // 토큰 설정
  const handleSetToken = () => {
    const token = prompt('액세스 토큰을 입력하세요:');
    if (token) {
      setAccessToken(token);
      localStorage.setItem('accessToken', token);
      setIsAuthenticated(true);
      toast.success('토큰이 설정되었습니다!');
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logoutUser();
      setAccessToken('');
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  // 강제 로그아웃
  const handleForceLogout = () => {
    forceLogout();
    setAccessToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    toast.success('강제 로그아웃되었습니다.');
  };

  // 테스트 토큰 설정
  const handleSetTestToken = () => {
    const testToken = 'test-token-12345';
    setAccessToken(testToken);
    localStorage.setItem('accessToken', testToken);
    setIsAuthenticated(true);
    toast.success('테스트 토큰이 설정되었습니다!');
  };

  return {
    accessToken,
    isAuthenticated,
    handleGetCookieToken,
    handleShowAllCookies,
    handleShowOAuthLinks,
    handleSetToken,
    handleLogout,
    handleForceLogout,
    handleSetTestToken,
  };
}; 

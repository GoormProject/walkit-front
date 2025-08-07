import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Api } from '@/api/swagger-api';
import Button from '@/components/ui/Button';

interface FriendsSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const FriendsSearchBar = ({
  placeholder = '친구 검색...',
  value = '',
  onChange,
}: FriendsSearchBarProps): React.ReactNode => {
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const api = new Api({ withCredentials: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleRequest = async () => {
    if (!inputValue.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.api.sendFriendRequest({
        targetNickname: inputValue.trim(),
      });

      console.log('✅ [BACKEND] 친구 요청 응답:', response.data);

      // 성공 조건: 200 또는 201 상태 코드, 또는 httpStatus가 200/201
      const isSuccess =
        response.status === 200 ||
        response.status === 201 ||
        response.data.httpStatus === 200 ||
        response.data.httpStatus === 201;

      if (isSuccess) {
        alert('친구 요청을 보냈습니다.');
        setInputValue(''); // 입력값 초기화
        onChange?.(''); // 부모 컴포넌트에도 알림
      } else {
        alert(response.data.message || '친구 요청에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ 친구 요청 실패:', err);

      // 에러 상세 정보 출력
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { status?: number; data?: unknown };
        };
        console.error('❌ HTTP 상태 코드:', axiosError.response?.status);
        console.error('❌ 응답 데이터:', axiosError.response?.data);
      }

      alert('친구 요청에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRequest();
    }
  };

  return (
    <div className="w-full px-3 py-[2.5dvh]">
      <div className="relative w-full h-[1dvh] bg-[#f2f2f2] rounded-[20px] flex items-center px-2">
        <Search className="w-[18px] h-[18px] text-[#8c8c8c] mr-3" />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          placeholder={isFocused ? '' : placeholder}
          className="border-0 bg-transparent font-roboto-semibold font-semibold text-[#8c8c8c] text-[15px] p-0 h-auto focus-visible:ring-0 placeholder:text-[#8c8c8c] flex-1 outline-none"
        />
        {inputValue.trim() && (
          <Button
            onClick={handleRequest}
            disabled={isLoading}
            size="sm"
            className="ml-2 h-8 px-3 text-sm bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '요청중...' : '요청'}
          </Button>
        )}
      </div>
    </div>
  );
};

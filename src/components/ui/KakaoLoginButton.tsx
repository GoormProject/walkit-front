import React from 'react';

export interface KakaoLoginButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: number;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  size = 90,
}) => {
  // 600x90px 크기를 rem 단위로 변환 (Google 버튼과 일치)
  const widthRem = (600 * (size / 90)) / 16;
  const heightRem = (90 * (size / 90)) / 16;

  return (
    <button
      className={`
        relative inline-flex items-center justify-center
        bg-transparent border-none rounded-lg
        cursor-pointer
        outline-none overflow-hidden
        transition-all duration-200 ease-in-out
        hover:opacity-90
        focus:opacity-90
        disabled:cursor-default disabled:opacity-60
        ${className}
      `}
      style={{
        border: 'none',
        background: 'transparent',
        width: `${widthRem}rem`,
        height: `${heightRem}rem`,
      }}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {/* Kakao button image */}
      <img
        src="/kakao_login_button.png"
        alt="Kakao Login"
        className="w-full h-full object-cover rounded-lg"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </button>
  );
};

export default KakaoLoginButton;

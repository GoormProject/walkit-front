import React from 'react';

export interface KakaoSignupButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: number;
}

const KakaoSignupButton: React.FC<KakaoSignupButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  size = 90,
}) => {
  // 카카오 버튼 이미지의 실제 크기 (300x45px)
  const imageWidth = 300;
  const imageHeight = 45;

  // size를 높이 기준으로 스케일링하여 rem 단위로 변환
  const scale = size / imageHeight;
  const widthRem = (imageWidth * scale) / 16;
  const heightRem = (imageHeight * scale) / 16;

  // Tailwind 클래스와 인라인 스타일에서 공통으로 사용할 크기 값
  const sizeClasses = `w-[${widthRem}rem] h-[${heightRem}rem]`;
  const sizeStyles = {
    width: `${widthRem}rem`,
    height: `${heightRem}rem`,
  };

  console.log('Size:', size, 'Classes:', sizeClasses, 'Scale:', scale);

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
        ${sizeClasses}
        ${className}
      `}
      style={{
        border: 'none',
        background: 'transparent',
        ...sizeStyles,
      }}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {/* Kakao button image */}
      <img
        src="/kakao_login_button.png"
        alt="Kakao Signup"
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

export default KakaoSignupButton;

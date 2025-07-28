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
  // 이미지 크기에 맞춰 버튼 크기 조정
  const getSizeClasses = (size: number) => {
    // 카카오 버튼 이미지의 실제 크기 (300x45px)
    const imageWidth = 300;
    const imageHeight = 45;

    // size를 높이 기준으로 스케일링
    const scale = size / imageHeight;
    const widthRem = (imageWidth * scale) / 16;
    const heightRem = (imageHeight * scale) / 16;

    const sizeClasses = `w-[${widthRem}rem] h-[${heightRem}rem]`;
    console.log('Size:', size, 'Classes:', sizeClasses, 'Scale:', scale);

    return sizeClasses;
  };

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
        ${getSizeClasses(size)}
        ${className}
      `}
      style={{
        border: 'none',
        background: 'transparent',
        width: `${(300 * (size / 45)) / 16}rem`,
        height: `${(45 * (size / 45)) / 16}rem`,
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

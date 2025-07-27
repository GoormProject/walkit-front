interface HeaderProps {
  height?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * 헤더 컴포넌트
 */
const Header = ({ height = 'lg', className = '' }: HeaderProps) => {
  const heightClasses = {
    sm: 'h-header-sm',
    md: 'h-header-md',
    lg: 'h-header-lg',
    xl: 'h-header-xl',
  };

  return (
    <header
      className={`bg-white shadow-sm border-b border-gray-200 ${heightClasses[height]} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-full">
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="flex items-center">
              <h1 className="text-base font-semibold text-gray-900">WalkIt</h1>
              <span className="ml-2 text-xs text-gray-600">Header 입니다</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

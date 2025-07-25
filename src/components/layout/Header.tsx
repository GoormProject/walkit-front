interface HeaderProps {
  height?: string
  className?: string
}

/**
 * 헤더 컴포넌트
 */
const Header = ({ height = '100px', className = '' }: HeaderProps) => {
  return (
    <header className={`bg-white shadow-sm ${className}`} style={{ height, borderBottom: '1px solid var(--color-gray-200)' }}>
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
  )
}

export default Header 
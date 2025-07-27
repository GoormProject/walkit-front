import { Square } from 'lucide-react'

export interface HomeButtonProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const HomeButton = ({ 
  size = 'md', 
  className = ''
}: HomeButtonProps) => {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Square size={iconSize} />
    </div>
  )
}

export default HomeButton 
import { ChevronLeft } from 'lucide-react'

export interface FooterBackButtonProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const FooterBackButton = ({ 
  size = 'md', 
  className = ''
}: FooterBackButtonProps) => {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ChevronLeft size={iconSize} />
    </div>
  )
}

export default FooterBackButton 
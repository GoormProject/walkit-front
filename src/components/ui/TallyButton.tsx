import { Tally3 } from 'lucide-react'

export interface TallyButtonProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const TallyButton = ({ 
  size = 'md', 
  className = ''
}: TallyButtonProps) => {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Tally3 size={iconSize} />
    </div>
  )
}

export default TallyButton 
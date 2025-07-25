import { TallyButton, FooterBackButton, HomeButton } from '@/components/ui'

/**
 * 푸터 컴포넌트
 */
const Footer = () => {
  return (
    <footer className="mt-auto" style={{ height: '60px', backgroundColor: 'var(--color-gray-100)', borderTop: '1px solid var(--color-gray-100)' }}>
      <div className="h-full flex">
        <div className="flex-1 border-r flex items-center justify-center" style={{ borderColor: 'var(--color-gray-100)' }}>
          <TallyButton size="lg" />
        </div>
        <div className="flex-1 border-r flex items-center justify-center" style={{ borderColor: 'var(--color-gray-100)' }}>
          <HomeButton size="lg" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <FooterBackButton size="lg" />
        </div>
      </div>
    </footer>
  )
}

export default Footer 
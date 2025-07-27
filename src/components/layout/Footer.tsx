import { TallyButton, FooterBackButton, HomeButton } from '@/components/ui';

/**
 * 푸터 컴포넌트
 */
const Footer = () => {
  return (
    <footer className="mt-auto h-[80px] bg-gray-100 border-t border-gray-100">
      <div className="h-full flex">
        <div className="flex-1 border-r border-gray-100 flex items-center justify-center">
          <TallyButton size="lg" />
        </div>
        <div className="flex-1 border-r border-gray-100 flex items-center justify-center">
          <HomeButton size="lg" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <FooterBackButton size="lg" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import { Button } from '@/components/ui';

const ShadcnDialogTestPage = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        shadcn/ui Dialog 테스트
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 기본 Dialog */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">기본 Dialog</h2>
          <p className="text-sm text-gray-600 mb-4">
            shadcn/ui의 기본 Dialog입니다. 중앙에 표시됩니다.
          </p>

          <Dialog open={isOpen1} onOpenChange={setIsOpen1}>
            <DialogTrigger asChild>
              <Button>기본 Dialog 열기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>기본 Dialog</DialogTitle>
                <DialogDescription>
                  이것은 shadcn/ui의 기본 Dialog입니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Dialog 콘텐츠가 여기에 들어갑니다.</p>
                <div className="flex gap-2">
                  <Button onClick={() => setIsOpen1(false)}>확인</Button>
                  <Button variant="outline" onClick={() => setIsOpen1(false)}>
                    취소
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bottom Sheet 스타일 Dialog */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Bottom Sheet 스타일</h2>
          <p className="text-sm text-gray-600 mb-4">
            Dialog를 Bottom Sheet처럼 스타일링했습니다.
          </p>

          <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
            <DialogTrigger asChild>
              <Button>Bottom Sheet 열기</Button>
            </DialogTrigger>
            <DialogContent className="fixed bottom-0 left-0 right-0 rounded-t-xl rounded-b-none max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Bottom Sheet 제목</DialogTitle>
                <DialogDescription>
                  Dialog를 Bottom Sheet 스타일로 만든 예시입니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>스크롤 가능한 콘텐츠가 여기에 들어갑니다.</p>
                {/* 긴 콘텐츠 */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="p-3 bg-gray-100 rounded">
                    항목 {i + 1}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button onClick={() => setIsOpen2(false)}>확인</Button>
                  <Button variant="outline" onClick={() => setIsOpen2(false)}>
                    취소
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 커스텀 스타일 Dialog */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">커스텀 스타일</h2>
          <p className="text-sm text-gray-600 mb-4">
            완전히 커스터마이징된 Dialog입니다.
          </p>

          <Dialog open={isOpen3} onOpenChange={setIsOpen3}>
            <DialogTrigger asChild>
              <Button>커스텀 Dialog 열기</Button>
            </DialogTrigger>
            <DialogContent className="fixed bottom-0 left-0 right-0 rounded-t-xl rounded-b-none max-h-[60vh] bg-gradient-to-b from-blue-50 to-white border-blue-200">
              <DialogHeader className="border-b border-blue-200 pb-4">
                <DialogTitle className="text-blue-900">
                  커스텀 스타일
                </DialogTitle>
                <DialogDescription className="text-blue-700">
                  그라데이션과 커스텀 색상이 적용된 Dialog입니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    옵션 1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-700"
                  >
                    옵션 2
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-700"
                  >
                    옵션 3
                  </Button>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    옵션 4
                  </Button>
                </div>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => setIsOpen3(false)}
                >
                  확인
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 비교 정보 */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">shadcn/ui vs 커스텀</h2>
          <p className="text-sm text-gray-600 mb-4">
            shadcn/ui Dialog와 커스텀 BottomSheet 비교
          </p>

          <div className="space-y-3 text-sm">
            <div className="p-3 bg-green-50 rounded">
              <h3 className="font-semibold text-green-800">
                shadcn/ui Dialog 장점
              </h3>
              <ul className="text-green-700 mt-1 space-y-1">
                <li>• 완벽한 접근성 지원</li>
                <li>• 일관된 디자인 시스템</li>
                <li>• 쉬운 커스터마이징</li>
                <li>• TypeScript 완전 지원</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 rounded">
              <h3 className="font-semibold text-blue-800">
                커스텀 BottomSheet 장점
              </h3>
              <ul className="text-blue-700 mt-1 space-y-1">
                <li>• 스와이프 제스처 지원</li>
                <li>• 스냅 포인트 기능</li>
                <li>• 추가 의존성 없음</li>
                <li>• 완전한 제어 가능</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">사용법</h3>
        <div className="text-sm text-purple-800 space-y-2">
          <p>
            • <strong>기본 Dialog</strong>: 중앙에 표시되는 모달
          </p>
          <p>
            • <strong>Bottom Sheet 스타일</strong>: 하단에서 올라오는 스타일
          </p>
          <p>
            • <strong>커스텀 스타일</strong>: 완전히 커스터마이징된 스타일
          </p>
          <p>
            • <strong>ESC 키</strong>: 키보드 ESC 키로 닫기
          </p>
          <p>
            • <strong>백드롭 클릭</strong>: 배경 클릭으로 닫기
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShadcnDialogTestPage;

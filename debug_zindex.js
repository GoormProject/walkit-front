// 모든 요소의 z-index를 확인하는 스크립트
function debugZIndex() {
  const elements = document.querySelectorAll('*');
  const zIndexElements = [];
  
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    const zIndex = style.zIndex;
    if (zIndex !== 'auto' && zIndex !== '0') {
      zIndexElements.push({
        element: el,
        zIndex: parseInt(zIndex),
        className: el.className,
        tagName: el.tagName,
        position: style.position
      });
    }
  });
  
  // z-index 순으로 정렬
  zIndexElements.sort((a, b) => b.zIndex - a.zIndex);
  
  console.log('🔍 Z-Index 디버깅 결과:');
  zIndexElements.forEach(item => {
    console.log(`z-index: ${item.zIndex}, ${item.tagName}.${item.className}, position: ${item.position}`);
  });
  
  return zIndexElements;
}

// 브라우저 콘솔에서 debugZIndex() 실행
console.log('브라우저 콘솔에서 debugZIndex() 를 실행하세요');

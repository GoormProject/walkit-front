/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 여기에 디자인 토큰들을 추가할 예정
      colors: {
        // Figma에서 정의된 색상들을 여기에 추가
      },
      fontFamily: {
        // 타이포그래피 설정
      },
      spacing: {
        // 간격 설정
      }
    },
  },
  plugins: [],
} 

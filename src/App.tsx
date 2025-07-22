import { Routes, Route } from 'react-router-dom'
import Home from './pages/index'
import About from './pages/about'
import NotFound from './pages/notfound/index'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 홈 페이지 - src/pages/index.tsx */}
        <Route path="/" element={<Home />} />
        
        {/* About 페이지 - src/pages/about/index.tsx */}
        <Route path="/about" element={<About />} />
        
        {/* 404 페이지 - src/pages/notfound/index.tsx */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App

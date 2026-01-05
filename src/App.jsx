import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import { Navigation } from './components/Navigation'
import { Home } from './pages/Home'
import { Objectives } from './pages/Objectives'
import { Sessions } from './pages/Sessions'
import { Projects } from './pages/Projects'
import { Notes } from './pages/Notes'
import { Books } from './pages/Books'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gps-light dark:bg-gps-dark transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/objectives" element={<Objectives />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/books" element={<Books />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

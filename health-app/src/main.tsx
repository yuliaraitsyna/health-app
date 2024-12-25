import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HeartRatePage } from './components/HeartRatePage/HeartRatePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path='/heart_rate' element={<HeartRatePage />}></Route>
        <Route path='/sleep'></Route>
        <Route path='/about'></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

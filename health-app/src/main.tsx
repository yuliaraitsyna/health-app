import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HeartRatePage } from './components/HeartRatePage/HeartRatePage.tsx'
import { Main } from './components/Main/Main.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}>
          <Route path="/" element={<Main />} />
          <Route path='/heart_rate' element={<HeartRatePage />}></Route>
          <Route path='/sleep'></Route>
          <Route path='/about'></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

import { useState } from 'react'
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './Pages/HomePage/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

//Pages
import PlayerPage from './views/Player_Page.js'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayerPage />} />
      </Routes> 
    </Router>
  )
}

export default App
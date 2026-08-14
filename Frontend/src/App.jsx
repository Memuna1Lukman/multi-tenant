import { useState } from 'react'
import NavBar from './components/NavBar'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
function App() {
 

  return (
    <>
     
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element= {<SignUp/>} />
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App

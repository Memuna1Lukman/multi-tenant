import { useState } from 'react'
import NavBar from './components/NavBar'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoutes from './components/ProtectedRoutes';
import AuthProvider from './Hooks/useAuth';
function App() {
 

  return (
    <>
     <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />

          {/* Secure Protected Routes */}
          <Route 
            path='/dashboard' 
            element={
              <ProtectedRoutes>
                <Home /> {/* Your home dashboard view */}
              </ProtectedRoutes>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App

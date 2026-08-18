import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoutes from './components/ProtectedRoutes';
import AuthProvider from './Hooks/useAuth';
import { WorkProvider } from './Hooks/useWork';

// Navigation wrapper that conditionally shows the public NavBar only on public pages
function AppNavigation() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  // When user is on dashboard or authenticated layout, public NavBar is hidden
  if (isDashboard) {
    return null;
  }

  return <NavBar />;
}

// Authenticated Dashboard Layout with real responsive Sidebar / Mobile Navbar
function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#183b3a] via-[#122b2a] to-[#0d201f] text-slate-100 flex flex-col md:flex-row relative">
      {/* Sidebar: Real vertical sidebar on desktop, transforms into top Navbar on mobile */}
      <SideBar />

      {/* Main Content Area */}
      <main className="dashboard-main-content flex-1 p-4 sm:p-6 md:p-8 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WorkProvider>
        <BrowserRouter>
          {/* Public Top Navbar - Hides automatically when on dashboard */}
          <AppNavigation />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Authenticated Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <DashboardLayout>
                    <Home />
                  </DashboardLayout>
                </ProtectedRoutes>
              }
            />

            {/* Additional protected routes can easily be added here */}
            <Route
              path="/workspaces"
              element={
                <ProtectedRoutes>
                  <DashboardLayout>
                    <Home />
                  </DashboardLayout>
                </ProtectedRoutes>
              }
            />
          </Routes>
        </BrowserRouter>
      </WorkProvider>
    </AuthProvider>
  );
}

export default App;


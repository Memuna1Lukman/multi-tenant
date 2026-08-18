import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logos.png';
import { useAuth } from '../Hooks/useAuth';

export default function NavBar() {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Common style for links to handle active states nicely
  const getNavLinkClass = ({ isActive }) =>
    `transition-colors duration-200 hover:text-white ${
      isActive ? 'text-white font-medium' : 'text-emerald-100/80'
    }`;

  return (
    <header className="w-full bg-[#3b7a78]/40 backdrop-blur-md border-b border-white/10 px-6 py-4 fixed top-0 left-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-white text-2xl font-medium tracking-wide opacity-90 group-hover:opacity-100 transition-opacity">
            Exp<span className="text-emerald-200">ert</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <NavLink to="/" end className={getNavLinkClass}>
            Home
          </NavLink>
          <span className="text-emerald-200/40 text-xs">•</span>
          <NavLink to="/services" end className={getNavLinkClass}>
            Services
          </NavLink>
          <span className="text-emerald-200/40 text-xs">•</span>
          <NavLink to="/contact" end className={getNavLinkClass}>
            Contact
          </NavLink>
        </div>

        {/* Action Buttons & Mobile Menu Icon */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="text-sm bg-[#164e51] hover:bg-[#113e40] text-emerald-100 font-medium px-5 py-2 rounded-full transition-all duration-200 border border-emerald-400/20 shadow-inner flex items-center gap-2"
            >
              <span>Dashboard</span>
              <span className="text-xs">→</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-emerald-50 hover:text-white font-medium px-3 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-[#164e51] hover:bg-[#113e40] text-emerald-100 font-medium px-5 py-2 rounded-full transition-all duration-200 border border-emerald-400/20 shadow-inner"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile Hamburger Menu Icon */}
          <button 
            type="button" 
            aria-label="Toggle Menu"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-white hover:text-emerald-200 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </nav>

      {/* Mobile menu dropdown */}
      {isMobileOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2.5 pb-2">
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className="text-sm text-emerald-100/90 hover:text-white px-2 py-1"
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setIsMobileOpen(false)}
            className="text-sm text-emerald-100/90 hover:text-white px-2 py-1"
          >
            Services
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileOpen(false)}
            className="text-sm text-emerald-100/90 hover:text-white px-2 py-1"
          >
            Contact
          </Link>
          {!user ? (
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setIsMobileOpen(false)}
                className="text-sm text-emerald-200 font-medium px-3 py-1.5 rounded-lg bg-white/5"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileOpen(false)}
                className="text-sm text-white font-medium px-4 py-1.5 rounded-lg bg-[#164e51]"
              >
                Register
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              onClick={() => setIsMobileOpen(false)}
              className="text-sm text-white font-medium px-4 py-2 rounded-lg bg-[#164e51] text-center"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
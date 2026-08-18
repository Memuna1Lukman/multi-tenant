import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../Hooks/useAuth';
import useWork from '../Hooks/useWork';
import logo from '../assets/logos.png';

export default function SideBar({ onAddWorkspaceClick }) {
  const { user, logOut } = useAuth();
  const {
    workspaces = [],
    selectedWorkspace,
    setSelectedWorkspace,
    loading: workspacesLoading,
  } = useWork();

  const [isWorkspacesOpen, setIsWorkspacesOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  const handleWorkspaceSelect = (ws) => {
    if (setSelectedWorkspace) {
      setSelectedWorkspace(ws);
    }
    setIsMobileMenuOpen(false);
    navigate('/dashboard');
  };

  const handleAddWorkspace = () => {
    setIsMobileMenuOpen(false);
    if (onAddWorkspaceClick) {
      onAddWorkspaceClick();
    } else {
      // Default fallback event for adding workspaces
      const name = prompt('Enter new workspace name:');
      if (name && name.trim()) {
        window.dispatchEvent(
          new CustomEvent('open-add-workspace-modal', { detail: { name: name.trim() } })
        );
      }
    }
  };

  // Nav link helper classes
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 shadow-sm shadow-emerald-950/40'
        : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
    }`;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.full_name) {
      const parts = user.full_name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return user.full_name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'EX';
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE TOP NAVBAR (Visible only on mobile screens < 768px via media queries) */}
      {/* ========================================================================= */}
      <header className="mobile-navbar md:hidden fixed top-0 left-0 right-0 h-16 bg-[#143433]/95 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between z-50 shadow-lg">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1 shadow-sm">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-white text-xl font-medium tracking-wide">
            Exp<span className="text-emerald-300">ert</span>
          </span>
        </Link>

        {/* Center: Selected Workspace Pill (Mobile) */}
        {selectedWorkspace && (
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/50 border border-emerald-400/20 text-xs text-emerald-200 max-w-[140px] truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="truncate">{selectedWorkspace.name}</span>
          </div>
        )}

        {/* Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-emerald-100 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {isMobileMenuOpen ? (
            // Close X Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Drawer Backdrop & Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 pt-16"
            />

            {/* Mobile Slide Drawer Menu */}
            <motion.aside
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden fixed top-16 left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto bg-[#143433] border-b border-white/15 p-5 shadow-2xl z-50 flex flex-col gap-6"
            >
              {/* User Profile Mini Header */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-200 font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {user?.full_name || 'Property Manager'}
                    </span>
                    <span className="text-xs text-emerald-100/60 truncate max-w-[180px]">
                      {user?.email || 'Authenticated'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1.5">
                <NavLink
                  to="/dashboard"
                  end
                  className={getNavLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </NavLink>

                {/* Workspaces Section Accordion */}
                <div className="mt-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsWorkspacesOpen(!isWorkspacesOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-200/70 hover:text-emerald-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Workspaces</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300">
                        {workspaces.length}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isWorkspacesOpen ? 'rotate-180 text-emerald-300' : 'text-emerald-200/40'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Workspaces List Links */}
                  {isWorkspacesOpen && (
                    <div className="mt-1 flex flex-col gap-1 pl-2">
                      {workspacesLoading && (
                        <div className="px-3 py-2 text-xs text-emerald-200/50 flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
                          Loading workspaces...
                        </div>
                      )}

                      {!workspacesLoading && workspaces.length === 0 && (
                        <div className="px-3 py-2 text-xs text-emerald-200/50 italic">
                          No workspaces found
                        </div>
                      )}

                      {workspaces.map((ws) => {
                        const isCurrent =
                          selectedWorkspace?.id === ws.id ||
                          selectedWorkspace?.name === ws.name;
                        return (
                          <button
                            key={ws.id || ws.name}
                            type="button"
                            onClick={() => handleWorkspaceSelect(ws)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-all ${
                              isCurrent
                                ? 'bg-emerald-500/25 text-white font-medium border border-emerald-400/30'
                                : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span className="w-6 h-6 rounded-md bg-emerald-900/60 border border-emerald-400/30 flex items-center justify-center text-[10px] font-bold text-emerald-200 uppercase shrink-0">
                                {ws.name ? ws.name.charAt(0) : 'W'}
                              </span>
                              <span className="truncate">{ws.name}</span>
                            </div>
                            {isCurrent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                            )}
                          </button>
                        );
                      })}

                      {/* Add Workspace Button / Trigger */}
                      <button
                        type="button"
                        onClick={handleAddWorkspace}
                        className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-emerald-400/30 bg-emerald-950/20 text-xs font-medium text-emerald-300 hover:bg-emerald-900/30 hover:border-emerald-400/60 transition-all group"
                      >
                        <svg className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>+ Add Workspace</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Other Navigation Links */}
                <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1">
                  <NavLink
                    to="/dashboard"
                    className={getNavLinkClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>Projects</span>
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    type="button"
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-200 text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. DESKTOP REAL SIDEBAR (Visible only on >= 768px screens) */}
      {/* ========================================================================= */}
      <aside className="desktop-sidebar hidden md:flex flex-col justify-between fixed inset-y-0 left-0 w-64 lg:w-72 bg-[#133230]/95 backdrop-blur-xl border-r border-white/10 text-white z-40 shadow-2xl p-5 select-none">
        
        {/* Top Header & Brand */}
        <div className="flex flex-col gap-6">
          <Link to="/dashboard" className="flex items-center gap-3 px-1 group">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-2xl font-serif font-bold tracking-wide">
                Exp<span className="text-emerald-300">ert</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-200/60 font-medium">
                Workspace Portal
              </span>
            </div>
          </Link>

          {/* Current Workspace Quick Switcher / Status Pill */}
          {selectedWorkspace && (
            <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse"></span>
                <div className="flex flex-col truncate">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-200/60 font-medium">
                    Active Workspace
                  </span>
                  <span className="text-xs font-semibold text-white truncate">
                    {selectedWorkspace.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Section */}
          <nav className="flex flex-col gap-1.5 mt-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 custom-scrollbar">
            {/* Dashboard Link */}
            <NavLink to="/dashboard" end className={getNavLinkClass}>
              <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </NavLink>

            {/* ========================================================================= */}
            {/* WORKSPACE LINKS SECTION (Expandable / Tappable with all workspaces) */}
            {/* ========================================================================= */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsWorkspacesOpen(!isWorkspacesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-emerald-200/70 hover:text-emerald-100 hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Workspaces</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300 font-mono">
                    {workspaces.length}
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isWorkspacesOpen ? 'rotate-180 text-emerald-300' : 'text-emerald-200/40'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Workspaces Link Section */}
              <AnimatePresence>
                {isWorkspacesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 flex flex-col gap-1 pl-2 overflow-hidden"
                  >
                    {workspacesLoading && (
                      <div className="px-3 py-2 text-xs text-emerald-200/50 flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
                        Loading workspaces...
                      </div>
                    )}

                    {!workspacesLoading && workspaces.length === 0 && (
                      <div className="px-3 py-2 text-xs text-emerald-200/50 italic">
                        No workspaces found
                      </div>
                    )}

                    {/* Workspace Items List */}
                    {workspaces.map((ws) => {
                      const isCurrent =
                        selectedWorkspace?.id === ws.id ||
                        selectedWorkspace?.name === ws.name;
                      return (
                        <button
                          key={ws.id || ws.name}
                          type="button"
                          onClick={() => handleWorkspaceSelect(ws)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all duration-200 group cursor-pointer ${
                            isCurrent
                              ? 'bg-emerald-500/25 text-white border border-emerald-400/40 shadow-sm shadow-emerald-950/50'
                              : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold uppercase shrink-0 transition-colors ${
                                isCurrent
                                  ? 'bg-emerald-400 text-[#122b2a]'
                                  : 'bg-white/10 text-emerald-200 group-hover:bg-white/20'
                              }`}
                            >
                              {ws.name ? ws.name.charAt(0) : 'W'}
                            </span>
                            <span className="truncate">{ws.name}</span>
                          </div>
                          {isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400"></span>
                          ) : (
                            <span className="text-[10px] text-emerald-200/30 group-hover:text-emerald-200/70">
                              →
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {/* Add Workspace Action Button */}
                    <button
                      type="button"
                      onClick={handleAddWorkspace}
                      className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-emerald-400/30 bg-emerald-950/20 text-xs font-medium text-emerald-200 hover:text-white hover:bg-emerald-900/40 hover:border-emerald-400/60 transition-all duration-200 shadow-sm group cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>+ Add Workspace</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Navigation Links */}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1">
              <NavLink to="/dashboard" className={getNavLinkClass}>
                <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>Projects</span>
              </NavLink>

              <NavLink to="/dashboard" className={getNavLinkClass}>
                <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Tasks</span>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM USER PROFILE & LOGOUT SECTION */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
          {/* User Info Card */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-full bg-emerald-600/40 border border-emerald-400/40 flex items-center justify-center text-emerald-200 font-bold text-xs shrink-0 shadow-inner">
                {getUserInitials()}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white truncate">
                  {user?.full_name || 'Property Manager'}
                </span>
                <span className="text-[10px] text-emerald-200/60 truncate">
                  {user?.email || 'Logged In'}
                </span>
              </div>
            </div>

            {/* Quick Logout Icon Button */}
            <button
              onClick={handleLogout}
              type="button"
              title="Log Out"
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-300 hover:text-red-100 border border-red-500/20 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}

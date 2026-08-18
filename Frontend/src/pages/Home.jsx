import { motion } from 'motion/react';
import { useAuth } from '../Hooks/useAuth';
import useWork from '../Hooks/useWork';

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function Home() {
  const { user } = useAuth();
  const { workspaces = [], selectedWorkspace, setSelectedWorkspace } = useWork();

  const handleAddWorkspaceClick = () => {
    // Triggers custom event or prompt that user's new component will hook into
    const name = prompt('Enter new workspace name:');
    if (name && name.trim()) {
      window.dispatchEvent(
        new CustomEvent('open-add-workspace-modal', { detail: { name: name.trim() } })
      );
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* Header Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#1b4e4c] via-[#163f3d] to-[#113130] p-6 sm:p-8 border border-white/10 shadow-2xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-xs font-medium text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Workspace Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Welcome back, {user?.full_name || user?.email || 'Partner'}!
            </h1>
            <p className="text-sm text-emerald-100/70 max-w-xl">
              {selectedWorkspace
                ? `Currently managing: ${selectedWorkspace.name}. Monitor tenant operations, collaborate, and track project tasks seamlessly.`
                : 'Select or create a workspace from the sidebar to start managing your properties and tenants.'}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddWorkspaceClick}
            type="button"
            className="self-start md:self-auto inline-flex items-center gap-2 bg-[#1b5e5c] hover:bg-[#154b49] text-emerald-100 px-5 py-2.5 rounded-xl font-medium text-sm border border-emerald-400/30 shadow-lg cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Workspace</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workspaces */}
        <div className="bg-[#153837]/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-200/70 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Workspaces</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-serif">{workspaces.length}</div>
          <span className="text-[11px] text-emerald-100/50 mt-1">Available in sidebar</span>
        </div>

        {/* Active Workspace */}
        <div className="bg-[#153837]/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-200/70 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold">Current Workspace</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-lg font-bold text-white truncate">
            {selectedWorkspace?.name || 'None Selected'}
          </div>
          <span className="text-[11px] text-emerald-300 mt-1">Active Status: Live</span>
        </div>

        {/* Projects */}
        <div className="bg-[#153837]/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-200/70 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold">Properties & Projects</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-serif">0</div>
          <span className="text-[11px] text-emerald-100/50 mt-1">In this workspace</span>
        </div>

        {/* Tasks */}
        <div className="bg-[#153837]/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-200/70 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold">Open Tasks</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-serif">0</div>
          <span className="text-[11px] text-emerald-100/50 mt-1">Pending review</span>
        </div>
      </motion.div>

      {/* Workspaces Link Explorer Card */}
      <motion.div
        variants={itemVariants}
        className="bg-[#153837]/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-serif font-semibold text-white">Your Workspaces</h2>
            <p className="text-xs text-emerald-100/60">
              Click any workspace below or in the sidebar to switch active context
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-400/20">
            {workspaces.length} Total
          </span>
        </div>

        {workspaces.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/5 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-sm text-emerald-100/80 font-medium">No workspaces yet</p>
            <p className="text-xs text-emerald-100/50 max-w-sm mx-auto">
              Get started by adding your first workspace. You can use the "+ Add Workspace" button in the sidebar or below.
            </p>
            <button
              onClick={handleAddWorkspaceClick}
              type="button"
              className="mt-2 inline-flex items-center gap-2 bg-[#1b5e5c] hover:bg-[#154b49] text-emerald-100 text-xs font-medium px-4 py-2 rounded-xl border border-emerald-400/20 shadow-md cursor-pointer transition-colors"
            >
              + Create First Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {workspaces.map((ws) => {
              const isCurrent =
                selectedWorkspace?.id === ws.id || selectedWorkspace?.name === ws.name;
              return (
                <div
                  key={ws.id || ws.name}
                  onClick={() => setSelectedWorkspace && setSelectedWorkspace(ws)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-emerald-500/20 border-emerald-400/40 shadow-md shadow-emerald-950/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-9 h-9 rounded-xl bg-emerald-900/60 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-200 uppercase text-xs shrink-0">
                      {ws.name ? ws.name.charAt(0) : 'W'}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-semibold text-white truncate">{ws.name}</span>
                      <span className="text-[10px] text-emerald-200/50">
                        {isCurrent ? 'Active Workspace' : 'Click to select'}
                      </span>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}


import React, { useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../Hooks/useAuth';
// Staggered entrance variants for smooth loading
const containerVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function SignUp() {
  const [email,setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const { register,loading } = useAuth()
  const navigate = useNavigate()
  const handleSubmit= async(e)=>{
    e.preventDefault()
    setError("")
    try {
      await register({"full_name":fullName,email,"password_hash":password})
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || "An unexpected error occurred")
    }

  }
  return (
    <div className="min-h-screen bg-linear-to-b from-[#2d6260] via-[#204947] to-[#122b2a] flex items-center justify-center pt-20 pb-5 px-4">
      
      {/* Sign Up Card Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-auto mb-3 w-full max-w-4xl bg-[#183b3a]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        
        {/* Left Side: Textured Teal Image Banner */}
        <div className="relative min-h-55 md:min-h-137.5 flex flex-col justify-between p-8 overflow-hidden bg-[#1f4846]">
          {/* Background Image with Gradient Overlay & Slow ambient motion */}
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay overflow-hidden">
            <motion.img 
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{
                duration: 14,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80" 
              alt="Textured Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#122b2a] via-[#1a4240]/60 to-transparent" />
          </div>

          {/* Left Panel Content */}
          <motion.div variants={itemVariants} className="relative z-10">
            <Link to="/" className="inline-block text-white text-lg font-serif font-semibold tracking-wide">
              Exp<span className="text-emerald-300">ert</span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="relative z-10 my-auto pt-3">
            <h2 className="text-6xl font-serif text-emerald-50 mb-2">
              Start Managing Properties Smarter.
            </h2>
            <p className="text-sm text-emerald-100/70 font-light leading-relaxed">
              Create your account today and experience the premier tenant management workspace.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative z-10 text-xs text-emerald-200/50">
            © Expert Property Management
          </motion.div>
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-[#153433]/90">
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-2xl font-serif text-white mb-1">Create Account</h3>
            <p className="text-xs text-emerald-100/60">Fill in your details to get started</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-xs bg-red-500/15 border border-red-500/30 text-red-200 rounded-xl">
                  {error}
                </div>
            )}

            {/* Username Field */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-medium text-emerald-100/80">
                Full Name
              </label>
              <input 
                type="text" 
                onChange={(e)=>setFullName(e.target.value)}
                value={fullName}
                id="username"
                placeholder="johndoe"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-emerald-100/30 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-200"
              />
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-emerald-100/80">
                Email Address
              </label>
              <input
                onChange={(e)=>setEmail(e.target.value)}
                value={email} 
                type="email" 
                id="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-emerald-100/30 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-200"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-emerald-100/80">
                Password
              </label>
              <input
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
                type="password" 
                id="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-emerald-100/30 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-200"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }} 
                whileTap={{ scale: 0.98, y: 0 }} 
                transition={{ type: "spring", stiffness: 400, damping: 17, mass: 1 }} 
                type="submit"
                className="w-full mt-2 bg-[#1b5e5c] hover:bg-[#154b49] text-emerald-100 font-medium py-3 px-4 rounded-xl text-sm transition-colors duration-200 border border-emerald-400/20 shadow-lg hover:shadow-emerald-950/50 cursor-pointer"
              >
                Sign Up
              </motion.button>
            </motion.div>

            {/* Redirect to Login */}
            <motion.p variants={itemVariants} className="text-center text-xs text-emerald-100/60 pt-4">
              Do you already have an account?{' '}
              <Link to="/login" className="text-emerald-300 hover:underline font-medium ml-1 inline-block">
                Log In
              </Link>
            </motion.p>

          </form>
        </div>

      </motion.div>
    </div>
  );
}
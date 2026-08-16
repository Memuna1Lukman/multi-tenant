import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react'


export default function SignUp() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#2d6260] via-[#204947] to-[#122b2a] flex items-center justify-center p-4 sm:p-6">
      
      {/* Sign Up Card Container */}
      <div className="mt-auto mb-3 w-full max-w-4xl bg-[#183b3a]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Textured Teal Image Banner */}
        <div className="relative min-h-55 md:min-h-137.5 flex flex-col justify-between p-8 overflow-hidden bg-[#1f4846]">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay">
            <img 
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80" 
              alt="Textured Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#122b2a] via-[#1a4240]/60 to-transparent" />
          </div>

          {/* Left Panel Content */}
          <div className="relative z-10">
            <Link to="/" className="inline-block text-white text-lg font-serif font-semibold tracking-wide">
            Exp<span className="text-emerald-300">ert</span>
            </Link>
          </div>

          <div className="relative z-10 my-auto pt-3">
            <h2 className="text-6xl font-serif text-emerald-50 mb-2">
              Start Managing Properties Smarter.
            </h2>
            <p className="text-sm text-emerald-100/70 font-light leading-relaxed">
              Create your account today and experience the premier tenant management workspace.
            </p>
          </div>

          <div className="relative z-10 text-xs text-emerald-200/50">
            © Expert Property Management
          </div>
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-[#153433]/90">
          <div className="mb-8">
            <h3 className="text-2xl font-serif text-white mb-1">Create Account</h3>
            <p className="text-xs text-emerald-100/60">Fill in your details to get started</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            
            {/* Username Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-medium text-emerald-100/80">
                Username
              </label>
              <input 
                type="text" 
                id="username"
                placeholder="johndoe"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-emerald-100/30 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-200"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-emerald-100/80">
                Email Address
              </label>
              <input 
                type="email" 
                id="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-emerald-100/30 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-200"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-emerald-100/80">
                Password
              </label>
              <input 
                type="password" 
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-emerald-100/30 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full mt-2 bg-[#1b5e5c] hover:bg-[#154b49] text-emerald-100 font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 border border-emerald-400/20 shadow-lg hover:shadow-emerald-950/50"
            >
              Sign Up
            </button>

            {/* Redirect to Login */}
            <p className="text-center text-xs text-emerald-100/60 pt-4">
              Do you already have an account?{' '}
              <Link to="/login" className="text-emerald-300 hover:underline font-medium ml-1">
                Log In
              </Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}
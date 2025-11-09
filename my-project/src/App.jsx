import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { features } from './data/features.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#001a3d] text-white font-sans">
      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-6 md:px-16 py-4 border-b border-white/10 bg-[#001a3d]/95 backdrop-blur supports-[backdrop-filter]:bg-[#001a3d]/85 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold tracking-wide flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2" />
            MoveOn
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-sm">
          <NavLink to="/" end className={({isActive}) => `hover:text-yellow-400 transition-colors ${isActive ? 'text-yellow-400' : ''}`}>Home</NavLink>
          <NavLink to="/features" className={({isActive}) => `hover:text-yellow-400 transition-colors ${isActive ? 'text-yellow-400' : ''}`}>Features</NavLink>
          <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
          <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
          {!user && <NavLink to="/login" className={({isActive}) => `px-4 py-1.5 border border-yellow-400 text-yellow-400 rounded hover:bg-yellow-400 hover:text-[#001a3d] transition-colors text-sm font-medium ${isActive ? 'bg-yellow-400 text-[#001a3d]' : ''}`}>Log in</NavLink>}
          {!user && <NavLink to="/register" className={({isActive}) => `px-4 py-1.5 border border-yellow-400/40 text-yellow-300 rounded hover:border-yellow-400 hover:text-yellow-400 transition-colors text-sm font-medium ${isActive ? 'border-yellow-400 text-yellow-400' : ''}`}>Register</NavLink>}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/70">{user.role === 'coach' ? 'Coach' : 'Trainee'} | {user.email}</span>
              <button onClick={() => { logout(); navigate('/'); }} className="px-3 py-1 text-xs rounded bg-yellow-400 text-[#001a3d] font-medium hover:bg-yellow-300">Logout</button>
            </div>
          )}
        </nav>
        <button className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded" aria-label="Open Menu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </header>

      <Outlet />

      <footer className="px-6 md:px-16 py-8 text-center text-xs text-white/50 border-t border-white/10">
        © {new Date().getFullYear()} MoveOn. All rights reserved.
      </footer>
    </div>
  )
}

// Keep existing landing sections as a separate component
export function HomeLanding() {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="px-6 md:px-16 pt-14 pb-24 relative overflow-hidden">
        <div className="max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight md:leading-[1.15] tracking-tight">
            ACHIEVE YOUR
            <br />
            FITNESS GOALS
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-white/80">
            Empowering coaches and participants with personalized workout and meal planning.
          </p>
          <div className="mt-8">
            <NavLink to="/features" className="inline-block bg-yellow-400 text-[#001a3d] font-semibold px-6 py-3 rounded shadow hover:shadow-lg hover:bg-yellow-300 transition">Get Started</NavLink>
          </div>
        </div>
        {/* Illustration (simple placeholder lines) */}
        <div className="absolute right-6 md:right-20 top-20 hidden md:block">
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
            <circle cx="150" cy="150" r="140" stroke="#FDBF00" strokeWidth="4" strokeDasharray="10 14" />
            <path d="M120 180 L150 110 L180 180" stroke="#FDBF00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="150" cy="95" r="22" stroke="#FDBF00" strokeWidth="4" />
            <path d="M130 200 Q150 215 170 200" stroke="#FDBF00" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-16 py-20 bg-[#002451]">
        <h2 className="text-center text-2xl md:text-3xl font-bold tracking-wide text-yellow-400 mb-12">FEATURES</h2>
        <div className="grid gap-6 md:gap-8 md:grid-cols-4">
          {features.map((f) => (
            <NavLink to={`/feature/${f.slug}`} key={f.slug} className="bg-[#001f47] rounded-lg p-6 shadow-sm border border-white/5 hover:border-yellow-400/40 transition group focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-md bg-[#003266] text-yellow-400 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{f.short}</p>
              <span className="mt-3 inline-block text-xs font-medium text-yellow-400 group-hover:underline">Learn More →</span>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Secondary Feature Explanation */}
      <section className="px-6 md:px-16 py-16 bg-[#001a3d]">
        <h2 className="text-2xl font-bold text-yellow-400 mb-8">FEATURES</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl">
          {features.slice(0,3).map(f => (
            <div key={f.slug}>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{f.short}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
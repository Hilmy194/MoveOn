import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirm: '', role: 'trainee' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Email & password required')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 600))
      register(form.email, form.role)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#001a3d] text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#002451] border border-white/10 rounded-xl p-8 shadow-md">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Create Account</h1>
        <p className="text-sm text-white/60 mb-6">Register as a coach or trainee to get started.</p>
        {error && <div className="mb-4 text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded bg-[#001f47] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm outline-none" placeholder="you@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full rounded bg-[#001f47] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} className="w-full rounded bg-[#001f47] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <div className="grid grid-cols-2 gap-3">
              {['coach','trainee'].map(r => (
                <label key={r} className={`relative flex items-center justify-center rounded-lg border cursor-pointer px-3 py-2 text-sm font-medium transition ${form.role===r ? 'border-yellow-400 bg-[#003266]' : 'border-white/10 hover:border-yellow-400/50'}`}> 
                  <input type="radio" name="role" value={r} checked={form.role===r} onChange={handleChange} className="sr-only" />
                  {r === 'coach' ? 'Coach' : 'Trainee'}
                </label>
              ))}
            </div>
          </div>
          <button disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#001a3d] font-semibold rounded py-2 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-xs text-white/60 text-center">Already have an account? <NavLink to="/login" className="text-yellow-400 hover:underline">Log In</NavLink></p>
      </div>
    </div>
  )
}

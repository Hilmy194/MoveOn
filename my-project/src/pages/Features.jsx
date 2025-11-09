import React from 'react'
import { NavLink } from 'react-router-dom'
import { features } from '../data/features.jsx'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#001a3d] text-white px-6 md:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">Platform Features</h1>
        <p className="text-white/70 max-w-2xl mb-12 text-sm md:text-base">Choose a module to learn more about how it helps accelerate training outcomes and coaching clarity.</p>

        <div className="grid gap-8 md:grid-cols-4">
          {features.map(f => (
            <NavLink key={f.slug} to={`/feature/${f.slug}`} className="group bg-[#002451] rounded-lg p-6 border border-white/5 hover:border-yellow-400/40 transition block focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-md bg-[#003266] text-yellow-400 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h2 className="font-semibold text-lg mb-2">{f.title}</h2>
              <p className="text-sm text-white/70 leading-relaxed">{f.short}</p>
              <span className="mt-4 inline-block text-xs font-medium text-yellow-400 group-hover:underline">Learn More →</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import './index.css' // Ensure index.css is imported

function App() {
  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="bg-surface-beige p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-primary/20">
        <h1 className="text-3xl font-display font-bold text-primary mb-4">Student Flow CMS</h1>
        <p className="text-text-main mb-6 font-body">
          Welcome to the Content Management System.
        </p>
        <div className="p-4 bg-white/50 rounded mb-6">
          <p className="text-sm text-text-muted">Status: <span className="text-green-600 font-bold">Active</span></p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-glow-cta">
          Enter Dashboard
        </button>
      </div>
    </div>
  )
}

export default App

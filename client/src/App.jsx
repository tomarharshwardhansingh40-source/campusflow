import { useState, useEffect } from 'react'

function App() {
  const [healthStatus, setHealthStatus] = useState({ loading: true, data: null, error: null })

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then((data) => setHealthStatus({ loading: false, data, error: null }))
      .catch((err) => setHealthStatus({ loading: false, data: null, error: err.message }))
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          CampusFlow
        </h1>
        <p className="text-slate-400 text-sm">
          Phase 1: Setup & Vite Proxy Shell
        </p>

        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 text-left font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Backend Health (/api/health):</span>
            {healthStatus.loading && (
              <span className="text-amber-400 font-semibold">Checking...</span>
            )}
            {!healthStatus.loading && healthStatus.data && (
              <span className="text-emerald-400 font-semibold">Online</span>
            )}
            {!healthStatus.loading && healthStatus.error && (
              <span className="text-rose-400 font-semibold">Offline</span>
            )}
          </div>

          {healthStatus.data && (
            <pre className="text-emerald-300 overflow-x-auto p-2 bg-slate-900 rounded">
              {JSON.stringify(healthStatus.data, null, 2)}
            </pre>
          )}

          {healthStatus.error && (
            <p className="text-rose-400">
              Error connecting to backend: {healthStatus.error}. Make sure Express is running on port 5000.
            </p>
          )}
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Tailwind CSS & Vite Verified
          </span>
        </div>
      </div>
    </div>
  )
}

export default App

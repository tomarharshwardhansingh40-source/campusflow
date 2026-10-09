import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react'

export default function AuthPage() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register({ name, email, password, role, inviteCode })
      }
      navigate('/')
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleFillDemo = (demoRole) => {
    setIsLogin(true)
    setErrorMessage('')
    if (demoRole === 'faculty') {
      setEmail('faculty@demo.edu')
      setPassword('password123')
    } else {
      setEmail('student@demo.edu')
      setPassword('password123')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and title */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/5">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-white">
          CampusFlow
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Smart College Management & Student Collaboration Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-800">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true)
                setErrorMessage('')
              }}
              className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition ${
                isLogin
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false)
                setErrorMessage('')
              }}
              className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition ${
                !isLogin
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration Fields */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Jane Smith"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Role Picker */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-medium border transition ${
                        role === 'student'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('faculty')}
                      className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-medium border transition ${
                        role === 'faculty'
                          ? 'bg-purple-500/15 border-purple-500 text-purple-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Faculty</span>
                    </button>
                  </div>
                </div>

                {/* Invite Code for Faculty */}
                {role === 'faculty' && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-1">
                    <label className="block text-xs font-medium text-purple-200">
                      Faculty Invite Code <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Enter verification code"
                      className="w-full px-3 py-2 bg-slate-950 border border-purple-700/60 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-[11px] text-purple-300/80">
                      Required by college administration to register faculty accounts.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                College Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@demo.edu"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password {isLogin ? '' : '(min 8 characters)'}
              </label>
              <input
                type="password"
                required
                minLength={isLogin ? 1 : 8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>{isLogin ? 'Authenticating...' : 'Registering...'}</span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          {isLogin && (
            <div className="mt-6 pt-5 border-t border-slate-800">
              <p className="text-[11px] font-medium text-slate-400 mb-2 text-center">
                Quick Demo Fill (Pre-seeded Accounts):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('faculty')}
                  className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-purple-300 transition text-center"
                >
                  Dr. Sharma (Faculty)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('student')}
                  className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-emerald-300 transition text-center"
                >
                  Alex (Student)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

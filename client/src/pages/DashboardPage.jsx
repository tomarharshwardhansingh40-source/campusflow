import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import { Sparkles, BookOpen, Bell, FileText, CheckCircle2 } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Phase 3: Authentication Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Logged in as <span className="font-semibold text-white capitalize">{user?.role}</span> ({user?.email})
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Placeholder cards informing about upcoming Phase 4 & 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white">Courses Module</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {user?.role === 'faculty'
                ? 'Create and manage courses, publish syllabi, and monitor enrollments.'
                : 'Browse available courses, join classrooms, and view active professors.'}
            </p>
            <div className="pt-2 text-[11px] font-medium text-slate-500">Coming in Phase 4</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white">Announcements & Deadlines</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {user?.role === 'faculty'
                ? 'Broadcast college-wide alerts, schedule exams, and assign due dates.'
                : 'Real-time updates, exam notices, and assignments filtered to your enrolled courses.'}
            </p>
            <div className="pt-2 text-[11px] font-medium text-slate-500">Coming in Phase 4 & 5</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white">Ask CampusFlow AI</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask questions about your due dates, announcements, and notes with automated Gemini Flash integration.
            </p>
            <div className="pt-2 text-[11px] font-medium text-slate-500">Coming in Phase 6</div>
          </div>
        </div>
      </main>
    </div>
  )
}


"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Login failed')
            }

            router.push('/')
            router.refresh()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-ramadan-100/50 to-transparent" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-ramadan-200 rounded-full blur-3xl opacity-30" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="max-w-md w-full mx-4 glass-card rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-ramadan-500 to-ramadan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-ramadan-500/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold heading-font text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Sign in to access the dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-slide-in-down">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Username</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ramadan-500 transition-colors" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-ramadan-100 focus:border-ramadan-200 transition-all"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ramadan-500 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-ramadan-100 focus:border-ramadan-200 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-ramadan-600 to-ramadan-500 hover:from-ramadan-700 hover:to-ramadan-600 text-white font-bold rounded-xl shadow-lg shadow-ramadan-500/30 hover:shadow-ramadan-500/40 active:scale-95 transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">© 2026 qmexai. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

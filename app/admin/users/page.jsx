
"use client"
import { useEffect, useState } from 'react'
import { ArrowLeft, UserPlus, Shield, Trash2, Search } from 'lucide-react'
import Link from 'next/link'

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [message, setMessage] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        phone_number: '',
        password: '',
        role: 'admin'
    })

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const res = await fetch('/api/users')
            if (res.ok) {
                setUsers(await res.json())
            } else {
                // Handle unauthorized access by redirecting or showing error
                window.location.href = '/'
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Failed to create user')

            setMessage('✓ Admin user created successfully!')
            setFormData({ name: '', username: '', phone_number: '', password: '', role: 'admin' })
            setShowForm(false)
            loadUsers()
        } catch (err) {
            setMessage('✗ Error: ' + err.message)
        } finally {
            setLoading(false)
            setTimeout(() => setMessage(''), 3000)
        }
    }

    return (
        <div className="min-h-screen pb-12">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-ramadan-100/50 to-transparent pointer-events-none -z-10" />

            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm transition-all duration-300">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold heading-font text-gray-900">Manage Admins</h1>
                            <p className="text-xs text-gray-500">Superuser Access Only</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                {/* Actions & Messages */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ramadan-600 to-ramadan-500 hover:from-ramadan-700 hover:to-ramadan-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-ramadan-500/30 transition-all"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span>Add New Admin</span>
                    </button>

                    {message && (
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${message.includes('✓') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Add User Form */}
                {showForm && (
                    <div className="glass-card p-8 rounded-3xl animate-slide-in-down">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-ramadan-600" />
                            New Admin Details
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 transition-all" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Username</label>
                                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 transition-all" placeholder="johndoe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 transition-all" placeholder="1234567890" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Initial Password</label>
                                <input type="text" name="password" value={formData.password} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 transition-all" placeholder="SecretPass123" />
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition-all disabled:opacity-50">
                                    {loading ? 'Creating User...' : 'Create Admin User'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Users List */}
                <div className="glass-card rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{user.username}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${user.role === 'superuser' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone_number}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

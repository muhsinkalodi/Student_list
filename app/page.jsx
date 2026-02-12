"use client"
import { useEffect, useState } from 'react'
import { PlusCircle, Search, Calendar, Users, TrendingUp, Edit2, Trash2, Download } from 'lucide-react'

export default function RamadanDashboard() {
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Filters
  const [filters, setFilters] = useState({
    hostel_type: '',
    roll_number: '',
    year: ''
  })

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    college_type: '',
    roll_number: '',
    state: '',
    hostel_type: '',
    year: ''
  })

  // Custom hostel input
  const [customHostel, setCustomHostel] = useState('')

  const [user, setUser] = useState(null)

  useEffect(() => {
    checkUser()
    loadStudents()
  }, [filters])

  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        // Middleware should handle redirect, but strict client-side check can also go here
        window.location.href = '/login'
      }
    } catch (err) {
      console.error(err)
    }
  }

  const loadStudents = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.hostel_type) params.append('hostel_type', filters.hostel_type)
      if (filters.roll_number) params.append('roll_number', filters.roll_number)
      if (filters.year) params.append('year', filters.year)

      const res = await fetch(`/api?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch data')
      const data = await res.json()
      setStudents(data)
    } catch (err) {
      console.error(err)
      setMessage('Error loading data')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'hostel_type') {
      setFormData(prev => ({ ...prev, hostel_type: value }))
      if (value === 'Other') {
        setCustomHostel('')
      } else {
        setCustomHostel('')
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleCustomHostelChange = (e) => {
    setCustomHostel(e.target.value)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      // Use custom hostel if "Other" is selected
      const hostelValue = formData.hostel_type === 'Other' ? customHostel : formData.hostel_type
      const payload = editingId
        ? { ...formData, hostel_type: hostelValue, id: editingId }
        : { ...formData, hostel_type: hostelValue }

      const res = await fetch('/api', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(editingId ? 'Failed to update record' : 'Failed to add record')

      setFormData({ name: '', college_type: '', roll_number: '', state: '', hostel_type: '', year: '' })
      setCustomHostel('')
      setShowForm(false)
      setEditingId(null)
      setMessage(editingId ? '✓ Record updated successfully!' : '✓ Data added successfully!')
      setTimeout(() => setMessage(''), 3000)
      await loadStudents()
    } catch (err) {
      setMessage('✗ Error: ' + err.message)
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (student) => {
    const predefinedHostels = ['Boys Hostel', 'Girls Hostel', 'Green Hostel']
    if (student.hostel_type && !predefinedHostels.includes(student.hostel_type)) {
      // Custom hostel value
      setFormData({ ...student, hostel_type: 'Other' })
      setCustomHostel(student.hostel_type)
    } else {
      setFormData(student)
      setCustomHostel('')
    }
    setEditingId(student.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      const res = await fetch('/api', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error('Failed to delete record')
      setMessage('✓ Record deleted successfully!')
      setTimeout(() => setMessage(''), 3000)
      await loadStudents()
    } catch (err) {
      setMessage('✗ Error: ' + err.message)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDownload = async () => {
    try {
      const params = new URLSearchParams('download=pdf')
      if (filters.hostel_type) params.append('hostel_type', filters.hostel_type)
      if (filters.roll_number) params.append('roll_number', filters.roll_number)
      if (filters.year) params.append('year', filters.year)

      const res = await fetch(`/api?${params.toString()}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `student-list-${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setMessage('✗ Download failed: ' + err.message)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const cancelEdit = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', college_type: '', roll_number: '', state: '', hostel_type: '', year: '' })
    setCustomHostel('')
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-ramadan-100/50 to-transparent pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-ramadan-500 to-ramadan-600 text-white p-2.5 rounded-xl shadow-lg shadow-ramadan-500/20">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold heading-font text-gray-900 tracking-tight">Ramadan Data</h1>
                <p className="text-xs font-medium text-ramadan-600 uppercase tracking-wider">Collection & Analytics</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* User Info & Logout */}
              {user && (
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>

                  {user.role === 'superuser' && (
                    <a href="/admin/users" className="text-xs font-bold text-ramadan-600 hover:text-ramadan-700 bg-ramadan-50 px-3 py-1.5 rounded-lg border border-ramadan-100 hover:bg-ramadan-100 transition-colors">
                      Manage Admins
                    </a>
                  )}

                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      window.location.href = '/login';
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Logout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-full">Total</span>
              </div>
              <p className="text-4xl font-bold heading-font text-gray-800 mb-1">{students.length}</p>
              <p className="text-sm text-gray-500 font-medium">Registered Students</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">Active</span>
              </div>
              <p className="text-4xl font-bold heading-font text-gray-800 mb-1">{new Set(students.map(s => s.state)).size}</p>
              <p className="text-sm text-gray-500 font-medium">Represented States</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-purple-50 text-purple-600 rounded-full">Colleges</span>
              </div>
              <p className="text-4xl font-bold heading-font text-gray-800 mb-1">{new Set(students.map(s => s.college_type)).size}</p>
              <p className="text-sm text-gray-500 font-medium">Unique Institutions</p>
            </div>
          </div>
        </div>

        {/* Controls & Notification */}
        <div className="space-y-6">
          {message && (
            <div className={`p-4 rounded-xl flex items-center justify-between shadow-golden animate-slide-in-down glass border ${message.includes('✓')
              ? 'bg-emerald-50/80 border-emerald-100 text-emerald-800'
              : 'bg-red-50/80 border-red-100 text-red-800'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${message.includes('✓') ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <p className="font-semibold">{message}</p>
              </div>
            </div>
          )}

          <div className="glass-card p-2 rounded-2xl flex flex-col md:flex-row gap-2 items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:w-auto flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-ramadan-500 transition-colors" />
                <select
                  name="hostel_type"
                  value={filters.hostel_type}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-ramadan-100 transition-all cursor-pointer appearance-none"
                >
                  <option value="">All Hostels</option>
                  <option value="Boys Hostel">Boys Hostel</option>
                  <option value="Girls Hostel">Girls Hostel</option>
                  <option value="Green Hostel">Green Hostel</option>
                </select>
              </div>

              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-ramadan-500 transition-colors" />
                <input
                  type="text"
                  name="roll_number"
                  value={filters.roll_number}
                  onChange={handleFilterChange}
                  placeholder="Search Roll Number..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-ramadan-100 transition-all"
                />
              </div>

              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-ramadan-500 transition-colors" />
                <input
                  type="text"
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  placeholder="Filter by Year..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-ramadan-100 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto p-1">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-ramadan-600 to-ramadan-500 hover:from-ramadan-700 hover:to-ramadan-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-ramadan-500/30 hover:shadow-ramadan-500/40 active:scale-95 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add New</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl border border-gray-200 shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <Download className="w-5 h-5 text-gray-500" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="animate-slide-in-down bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
            <div className="bg-gradient-to-r from-ramadan-50 to-orange-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold heading-font text-gray-900 flex items-center gap-2">
                  {editingId ? <Edit2 className="w-5 h-5 text-ramadan-600" /> : <PlusCircle className="w-5 h-5 text-ramadan-600" />}
                  {editingId ? 'Edit Student Record' : 'New Student Registration'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Please fill in the details below carefully.</p>
              </div>
              <button onClick={cancelEdit} className="p-2 hover:bg-white/50 rounded-full transition">
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 focus:border-ramadan-200 transition-all font-medium"
                    placeholder="e.g. Abdullah Ahmed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Roll Number</label>
                  <input
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 focus:border-ramadan-200 transition-all font-mono text-sm"
                    placeholder="e.g. 2024-CS-001"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">College Type</label>
                  <input
                    type="text"
                    name="college_type"
                    value={formData.college_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 focus:border-ramadan-200 transition-all"
                    placeholder="e.g. Engineering"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 focus:border-ramadan-200 transition-all"
                    placeholder="e.g. Kerala"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hostel</label>
                  <div className="relative">
                    <select
                      name="hostel_type"
                      value={formData.hostel_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 focus:border-ramadan-200 transition-all appearance-none"
                    >
                      <option value="">Select Accommodation</option>
                      <option value="Boys Hostel">Boys Hostel</option>
                      <option value="Girls Hostel">Girls Hostel</option>
                      <option value="Green Hostel">Green Hostel</option>
                      <option value="Other">Other (Custom)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Users className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {formData.hostel_type === 'Other' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Custom Hostel Name</label>
                    <input
                      type="text"
                      value={customHostel}
                      onChange={handleCustomHostelChange}
                      placeholder="Enter hostel name"
                      className="w-full px-4 py-3 rounded-xl bg-orange-50 border-orange-100 focus:bg-white focus:ring-2 focus:ring-ramadan-100 transition-all"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Year</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ramadan-100 focus:border-ramadan-200 transition-all"
                    placeholder="e.g. 2nd Year"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-100 mt-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 rounded-xl font-bold bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-ramadan-600 to-ramadan-500 hover:from-ramadan-700 hover:to-ramadan-600 text-white shadow-lg shadow-ramadan-500/30 hover:shadow-ramadan-500/40 active:scale-95 transition-all disabled:opacity-70 disabled:scale-100"
                  >
                    {loading ? 'Processing...' : (editingId ? 'Update Record' : 'Save Record')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No.</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">College</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Hostel</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Added By</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {students.length > 0 ? (
                  students.map((s) => (
                    <tr
                      key={s.id}
                      className="group hover:bg-orange-50/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 group-hover:from-ramadan-100 group-hover:to-orange-100 group-hover:text-ramadan-700 transition-colors">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{s.roll_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{s.college_type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {s.state}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.hostel_type || s.hostel}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{s.year}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-700">{s.created_by_name || 'System'}</span>
                          <span className="text-[10px] text-gray-400">{s.created_at ? new Date(s.created_at).toLocaleDateString() : '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(s)}
                            className="p-2 text-gray-400 hover:text-ramadan-600 hover:bg-ramadan-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="font-medium">No records found</p>
                        <p className="text-sm opacity-60">Add a new student or adjust filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center pb-8 opacity-60">
        <p className="text-sm">
          Designed with <span className="text-red-500">♥</span> by <span className="font-bold">qmexai</span>
        </p>
      </footer>
    </div>
  )
}
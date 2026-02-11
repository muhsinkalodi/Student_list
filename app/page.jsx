"use client"
import { useEffect, useState } from 'react'
import { PlusCircle, Search, Calendar, Users, TrendingUp, Edit2, Trash2, Download } from 'lucide-react'

export default function RamadanDashboard(){
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

    useEffect(() => {
      loadStudents()
    }, [filters])

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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 text-white shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-8 h-8" />
                  <h1 className="text-4xl font-bold">Ramadan Data</h1>
                </div>
                <p className="text-amber-100 text-lg">Collection & Analytics</p>
              </div>
              <div className="text-right text-sm opacity-75">
                <p>© 2026 qmexai</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-semibold mb-1">Total Records</p>
                    <p className="text-3xl font-bold">{students.length}</p>
                  </div>
                  <Users className="w-12 h-12 opacity-30" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-semibold mb-1">Active States</p>
                    <p className="text-3xl font-bold">{new Set(students.map(s => s.state)).size}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 opacity-30" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-semibold mb-1">Colleges</p>
                    <p className="text-3xl font-bold">{new Set(students.map(s => s.college_type)).size}</p>
                  </div>
                  <Calendar className="w-12 h-12 opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Message Notification */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg font-semibold text-center transition-all ${
              message.includes('✓') 
                ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
                : 'bg-red-100 text-red-800 border-l-4 border-red-500'
            }`}>
              {message}
            </div>
          )}

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hostel Type</label>
              <select
                name="hostel_type"
                value={filters.hostel_type}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition bg-white"
              >
                <option value="">All Hostels</option>
                <option value="Boys Hostel">Boys Hostel</option>
                <option value="Girls Hostel">Girls Hostel</option>
                <option value="Green Hostel">Green Hostel</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
              <input
                type="text"
                name="roll_number"
                value={filters.roll_number}
                onChange={handleFilterChange}
                placeholder="Search roll number..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
              <input
                type="text"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                placeholder="e.g., 1st, 2nd, 3rd..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition bg-white"
              />
            </div>

            <div className="flex gap-2 items-end">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex-1 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                <PlusCircle className="w-5 h-5" />
                Add
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition"
                title="Download as professional PDF"
              >
                <Download className="w-5 h-5" />
                PDF
              </button>
            </div>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-orange-600" />
                {editingId ? 'Edit Record' : 'Add New Record'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number *</label>
                  <input
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition"
                    placeholder="Enter roll number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">College Type *</label>
                  <input
                    type="text"
                    name="college_type"
                    value={formData.college_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition"
                    placeholder="Enter college type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hostel Type</label>
                  <select
                    name="hostel_type"
                    value={formData.hostel_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition bg-white"
                  >
                    <option value="">Select Hostel</option>
                    <option value="Boys Hostel">Boys Hostel</option>
                    <option value="Girls Hostel">Girls Hostel</option>
                    <option value="Green Hostel">Green Hostel</option>
                    <option value="Other">Other (Custom)</option>
                  </select>
                </div>
                {formData.hostel_type === 'Other' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Hostel Name</label>
                    <input
                      type="text"
                      value={customHostel}
                      onChange={handleCustomHostelChange}
                      placeholder="Enter custom hostel name"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition bg-white"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition"
                    placeholder="e.g., 1st, 2nd, 3rd"
                  />
                </div>
                <div className="md:col-span-3 flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update Record' : 'Save Record')}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
                    <th className="px-4 py-3 text-left font-bold">Name</th>
                    <th className="px-4 py-3 text-left font-bold">Roll #</th>
                    <th className="px-4 py-3 text-left font-bold">College</th>
                    <th className="px-4 py-3 text-left font-bold">State</th>
                    <th className="px-4 py-3 text-left font-bold">Hostel</th>
                    <th className="px-4 py-3 text-left font-bold">Year</th>
                    <th className="px-4 py-3 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((s, idx) => (
                      <tr 
                        key={s.id}
                        className={`border-b border-gray-200 transition hover:bg-orange-50 ${
                          idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-800">{s.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-700 font-mono">{s.roll_number || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {s.college_type || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {s.state || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{s.hostel || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-700">{s.year || 'N/A'}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(s)}
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                              title="Edit record"
                              aria-label="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                              title="Delete record"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <p className="text-lg font-semibold">No records found</p>
                        <p className="text-sm mt-1">Adjust filters or add a new record</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-3">Ramadan Data System</h3>
                <p className="text-sm">A beautiful platform for collecting and managing Ramadan data with ease.</p>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-3">Features</h3>
                <ul className="text-sm space-y-2">
                  <li>✓ Real-time data collection</li>
                  <li>✓ Advanced search & filtering</li>
                  <li>✓ Beautiful analytics dashboard</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-3">Information</h3>
                <p className="text-sm">Version 2.0.0</p>
                <p className="text-sm mt-2">Copyright © 2026 <span className="font-bold text-orange-400">qmexai</span></p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 text-center text-sm">
              <p>Designed & Developed by <span className="font-bold text-orange-400">qmexai</span> | All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>
    )
}
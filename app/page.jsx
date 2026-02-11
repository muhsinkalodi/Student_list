"use client"
import { useEffect, useState } from 'react'

export default function StudentList(){
    const [students, setStudents]=useState([]);

    useEffect(() => {
      async function load() {
        try {
          const res = await fetch('/api');
          if (!res.ok) throw new Error('Failed to fetch students');
          const data = await res.json();
          setStudents(data);
        } catch (err) {
          console.error(err);
        }
      }
      load();
    }, []);

    return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Directory</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-4">Name</th>
              <th className="p-4">College</th>
              <th className="p-4">State</th>
              <th className="p-4">Phone</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id || s.roll_number} className="border-b hover:bg-gray-100">
                <td className="p-4">{s.name}</td>
                <td className="p-4">{s.college_type}</td>
                <td className="p-4 font-semibold text-blue-500">{s.state || "Kerala"}</td>
                <td className="p-4">{s.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
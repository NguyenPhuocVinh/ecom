import { useState } from 'react'
import './App.css'
import { Router, Routes } from 'react-router-dom'

function App() {


  return (
    <Router>
      <Routes>
        {/* Sửa lại Route để truyền onLogin */}
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard onLogout={() => handleLogin(false)} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App

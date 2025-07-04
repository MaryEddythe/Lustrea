"use client"

import type React from "react"

import { useState } from "react"
import AdminLogin from "@/components/admin/admin-login"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [credentials, setCredentials] = useState({ email: "", password: "" })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (credentials.email === "admin@luxenails.com" && credentials.password === "admin123") {
      setIsLoggedIn(true)
    } else {
      alert("Invalid credentials")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCredentials({ email: "", password: "" })
  }

  if (!isLoggedIn) {
    return <AdminLogin credentials={credentials} setCredentials={setCredentials} onLogin={handleLogin} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}

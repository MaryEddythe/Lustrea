"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface AdminLoginProps {
  credentials: { email: string; password: string }
  setCredentials: (credentials: { email: string; password: string }) => void
  onLogin: (e: React.FormEvent) => void
}

export default function AdminLogin({ credentials, setCredentials, onLogin }: AdminLoginProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="admin@luxenails.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="admin123"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
              Login
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">Demo credentials: admin@luxenails.com / admin123</p>
        </CardContent>
      </Card>
    </div>
  )
}

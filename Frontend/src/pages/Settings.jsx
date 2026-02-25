import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const Settings = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useOutletContext()

  useEffect(() => {
    fetchProfile()
  }, [])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  }

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/v1/user/me`, getAuthHeaders())
      if (res?.data?.success) {
        setFirstName(res?.data?.user?.firstName || '')
        setLastName(res?.data?.user?.lastName || '')
        setEmail(res?.data?.user?.email || '')
      } else {
        toast.error('Invalid profile response from server')
      }
    } catch (error) {
      if (error.response?.status === 400) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        toast.error('Session expired. Please login again.')
        return
      }
      toast.error(error.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('First name, last name and email are required')
      return
    }

    try {
      setSaving(true)
      const res = await axios.put(
        `${API_URL}/api/v1/user/me`,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
        },
        getAuthHeaders()
      )

      if (res?.data?.success) {
        const existingUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = {
          ...existingUser,
          firstName: res?.data?.user?.firstName || firstName.trim(),
          lastName: res?.data?.user?.lastName || lastName.trim(),
          email: res?.data?.user?.email || email.trim(),
        }

        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        toast.success('Settings updated successfully')
      } else {
        toast.error('Invalid settings response from server')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Settings</h2>
          <p className="mt-1 text-sm text-zinc-600">Manage your profile preferences and basic app configuration.</p>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="h-10"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="h-10"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-10"
                disabled={loading}
              />
            </div>

            <Button onClick={saveSettings} disabled={loading || saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings

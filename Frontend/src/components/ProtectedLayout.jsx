import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { HelpCircle, Home, ListTree, LogOut, Settings } from "lucide-react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const navItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Task Categories', to: '/categories', icon: ListTree },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Help', to: '/help', icon: HelpCircle },
]

const ProtectedLayout = () => {
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      navigate('/login')
      return
    }

    setUser(JSON.parse(userData))
    setCheckingAuth(false)
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (checkingAuth) {
    return <div className="min-h-screen bg-zinc-100" />
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-zinc-200 bg-white p-4 md:flex">
          <div className="mb-6 border-b border-zinc-200 pb-4">
            <h1 className="text-lg font-semibold text-zinc-900">Todo Workspace</h1>
            <p className="mt-1 text-sm text-zinc-500">{user?.firstName} {user?.lastName}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <Button variant="outline" className="mt-auto justify-start gap-2 border-zinc-300" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </aside>

        <div className="w-full">
          <div className="border-b border-zinc-200 bg-white p-3 md:hidden">
            <div className="mb-3">
              <p className="text-sm font-medium text-zinc-900">{user?.firstName} {user?.lastName}</p>
            </div>
            <nav className="flex gap-2 overflow-x-auto pb-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-md px-3 py-2 text-sm ${
                      isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Button variant="outline" className="h-auto whitespace-nowrap border-zinc-300 px-3 py-2 text-sm" onClick={logout}>
                Logout
              </Button>
            </nav>
          </div>

          <main>
            <Outlet context={{ user, setUser }} />
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProtectedLayout

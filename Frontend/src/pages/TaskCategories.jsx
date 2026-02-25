import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { Loader2, Plus, Tag, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const TaskCategories = () => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
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

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/v1/category`, getAuthHeaders())
      if (res?.data?.success) {
        setCategories(res?.data?.categories || [])
      } else {
        toast.error('Invalid categories response from server')
      }
    } catch (error) {
      if (error.response?.status === 400) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        toast.error('Session expired. Please login again.')
        return
      }
      toast.error(error.response?.data?.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async () => {
    const value = newCategory.trim()

    if (!value) {
      toast.error('Category name is required')
      return
    }

    try {
      setSaving(true)
      const res = await axios.post(
        `${API_URL}/api/v1/category`,
        { name: value },
        getAuthHeaders()
      )

      if (res?.data?.success) {
        setCategories((prev) => [res.data.category, ...prev])
        setNewCategory('')
        toast.success('Category added')
      } else {
        toast.error('Invalid add category response from server')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category')
    } finally {
      setSaving(false)
    }
  }

  const removeCategory = async (categoryId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/api/v1/category/${categoryId}`,
        getAuthHeaders()
      )

      if (res?.data?.success) {
        setCategories((prev) => prev.filter((item) => item._id !== categoryId))
        toast.success('Category deleted')
      } else {
        toast.error('Invalid delete category response from server')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category')
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Task Categories</h2>
          <p className="mt-1 text-sm text-zinc-600">Group tasks with simple categories to stay organized.</p>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900">Create Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  placeholder="Example: Health"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="h-10"
                />
              </div>
              <Button onClick={addCategory} disabled={saving} className="h-10 w-full sm:w-auto">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900">Existing Categories</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-6 text-sm text-zinc-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <p className="col-span-full text-sm text-zinc-500">No categories yet.</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                >
                  <Tag className="h-4 w-4 text-zinc-500" />
                  <span className="flex-1">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-zinc-500 hover:text-red-600"
                    onClick={() => removeCategory(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TaskCategories

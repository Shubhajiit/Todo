import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { Loader2, Plus, Edit2, Trash2, Check, X } from "lucide-react"
import { toast } from "sonner"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Button } from "@/components/ui/button"

const Home = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [newTodo, setNewTodo] = useState({ title: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [editingTodo, setEditingTodo] = useState({ title: '', description: '' })
  const navigate = useNavigate()
  const { user } = useOutletContext()

  useEffect(() => {
    fetchTodos()
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

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:8000/api/v1/todo/', getAuthHeaders())
      if (res.data.success) {
        setTodos(res.data.todos)
      }
    } catch (error) {
      console.log(error)
      if (error.response?.status === 400) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        toast.error('Session expired. Please login again.')
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch todos')
      }
    } finally {
      setLoading(false)
    }
  }

  const createTodo = async () => {
    if (!newTodo.title.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        'http://localhost:8000/api/v1/todo/',
        newTodo,
        getAuthHeaders()
      )
      
      if (res.data.success) {
        setTodos([res.data.todo, ...todos])
        setNewTodo({ title: '', description: '' })
        toast.success('Todo created successfully')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to create todo')
    } finally {
      setLoading(false)
    }
  }

  const deleteTodo = async (todoId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/todo/${todoId}`,
        getAuthHeaders()
      )
      
      if (res.data.success) {
        setTodos(todos.filter(todo => todo._id !== todoId))
        toast.success('Todo deleted successfully')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to delete todo')
    }
  }

  const updateTodo = async (todoId, updateData) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/todo/${todoId}`,
        updateData,
        getAuthHeaders()
      )
      
      if (res.data.success) {
        setTodos(todos.map(todo => 
          todo._id === todoId ? res.data.todo : todo
        ))
        setEditingId(null)
        setEditingTodo({ title: '', description: '' })
        toast.success('Todo updated successfully')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to update todo')
    }
  }

  const toggleComplete = async (todo) => {
    await updateTodo(todo._id, { isCompleted: !todo.isCompleted })
  }

  const startEdit = (todo) => {
    setEditingId(todo._id)
    setEditingTodo({ title: todo.title, description: todo.description })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTodo({ title: '', description: '' })
  }

  const saveEdit = async () => {
    if (!editingTodo.title.trim()) {
      toast.error('Title is required')
      return
    }
    
    await updateTodo(editingId, editingTodo)
  }

  if (loading && todos.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Todo App</h1>
            <p className="mt-1 text-sm text-zinc-600">Welcome back, {user?.firstName}!</p>
          </div>
        </div>

        {/* Add Todo Form */}
        <Card className="mb-6 border-zinc-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-zinc-900">
              <Plus className="h-4 w-4" />
              Add New Todo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter todo title..."
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Enter description..."
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="h-10"
                />
              </div>
              <Button onClick={createTodo} disabled={loading} className="h-10 w-full lg:w-auto lg:px-6">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Adding...</>
                ) : (
                  <>Add Todo</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-base text-zinc-500">No todos yet. Add your first todo above.</p>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card key={todo._id} className="border-zinc-200 bg-white shadow-sm">
                <CardContent className="p-4 sm:p-5">
                  {editingId === todo._id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingTodo.title}
                        onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                        placeholder="Title"
                        className="h-10"
                      />
                      <Input
                        value={editingTodo.description}
                        onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                        placeholder="Description"
                        className="h-10"
                      />
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} size="sm">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={cancelEdit} variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-1 items-start gap-3">
                        <input
                          type="checkbox"
                          checked={todo.isCompleted}
                          onChange={() => toggleComplete(todo)}
                          className="mt-1 h-4 w-4 rounded border-zinc-300"
                        />
                        <div className={`min-w-0 ${todo.isCompleted ? 'text-zinc-500' : 'text-zinc-900'}`}>
                          <h3 className={`font-medium ${todo.isCompleted ? 'line-through' : ''}`}>{todo.title}</h3>
                          {todo.description && (
                            <p className={`mt-1 text-sm ${todo.isCompleted ? 'line-through text-zinc-400' : 'text-zinc-600'}`}>
                              {todo.description}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-zinc-400">
                            Created: {new Date(todo.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 sm:justify-start">
                        <Button
                          onClick={() => startEdit(todo)}
                          variant="outline"
                          size="sm"
                          className="border-zinc-300"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteTodo(todo._id)}
                          variant="outline"
                          size="sm"
                          className="border-zinc-300 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Home


import React from 'react'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import ProtectedLayout from './components/ProtectedLayout'
import TaskCategories from './pages/TaskCategories'
import Settings from './pages/Settings'
import Help from './pages/Help'


const router = createBrowserRouter([
  {
    path:'/',
    element:<ProtectedLayout/>,
    children:[
      {
        index:true,
        element:<Home/>
      },
      {
        path:'categories',
        element:<TaskCategories/>
      },
      {
        path:'settings',
        element:<Settings/>
      },
      {
        path:'help',
        element:<Help/>
      }
    ]
  },
  {
    path:'/signup',
    element:<><Signup/></>
  },
  {
    path:'/login',
    element:<><Login/></>
  },
  {
    path:'/verify',
    element:<><Verify/></>
  },

  {
    path:'/verify/:token',
    element:<><VerifyEmail/></>
  },

])

const App = () => {
  return (
    <>

    <RouterProvider router={router}/>

    </>
  )
}

export default App

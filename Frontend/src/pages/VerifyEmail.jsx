import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const VerifyEmail = () => {



  const {token} = useParams() //Extract token 
  const [status, setStatus] = useState("Verifying...")
  const navigate =useNavigate()

  const verifyEmail =async()=>{
    try{

        const res = await axios.post(`${API_URL}/api/v1/user/verify`,{},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        if(res?.data?.success){
            setStatus('Email verified Successfully')
            setTimeout(()=>{

                navigate('/login')
            },2000)
        } else {
            setStatus("Invalid verification response")
        }

    }catch(error){
        console.log(error);
        setStatus(error?.response?.data?.message || "Verification failed")

    }
  }

  useEffect(()=>{
    verifyEmail()
  },[token])

  return (
    <div className='relative w-full h-[760px] bg-pink-100 overflow-hidden'>
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md'>
          <h2 className='text-xl font-semibold text-gray-800'>
            {status}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail

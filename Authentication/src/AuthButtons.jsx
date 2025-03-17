import React from 'react'
import { useNavigate } from 'react-router'

const AuthButtons = () => {
    const navigate = useNavigate()
  return (
    <div className=''>
        <div className='auth_container'>
            <h1>Choose an option</h1>
            <div className='buttons'>
                <button onClick={()=>navigate("/")} className='register_button'>Sign Up</button>
                <button onClick={()=>navigate("/Login")} className='login_button'>Login</button>
            </div>
        </div>
    </div>
  )
}

export default AuthButtons
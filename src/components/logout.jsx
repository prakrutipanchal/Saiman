import React from "react";
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from "react-router-dom";
import authService from '../supabase/auth';

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    authService.signOut()
      .then(() => {
        dispatch(logout());
        navigate('/signin');
      })
      .catch((error) => {
        console.log("Logout failed: ", error.message);
      });
  };

  return (
    <button 
      onClick={handleLogout}
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
    >
      Logout
    </button>
  );
}

import React, { useState } from "react";
import authService from "../supabase/auth";
import { useForm } from "react-hook-form";

function SignUp() 
{
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState();

  const signUpSubmit = async (data) => {
    try {
      const newUser = await authService.signUpNewUser(data);

      if (newUser) 
        {
        setMessage("SignUp successful!!");
        setTimeout(() => setMessage(''), 3000);  
        }
    }
    catch (error) 
    {
      setMessage(`Signup failed: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {message && (
          <div className={`mb-4 p-3 text-white rounded-md ${message.includes('failed') ? 'bg-red-500' : 'bg-green-500'}`}>
            {message}
          </div>
        )}
        
        <h2 className="text-black text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(signUpSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Full Name:</label>
            <input
              type="text"
              name="fullname"
              placeholder="Enter your name"
              className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("fullname", { required: "Full name is required" })}
            />
            {errors.fullname && <span className="text-red-500 text-sm">{errors.fullname.message}</span>}
          </div>

          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

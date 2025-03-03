import React, { useState } from "react";
import authService from "../supabase/auth";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignIn_Submit = async (data) => {
    try {
      const { data: signInData, error: signInError } = await authService.signInWithEmail(data);
  
      if (signInError) {
        throw new Error(signInError.message);
      }
  
      const userData = await authService.getCurrentUser();
      if (!userData) throw new Error("User authentication failed.");
  
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", data.email)
        .single();
  
      if (profileError) throw new Error("Failed to retrieve user role.");
  
      dispatch(login({ ...userData, role: profile.role }));
  
      // Navigate based on role
      if (profile.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
  
      setMessage("SignIn successful!");
    } catch (error) {
      setMessage(`SignIn failed: ${error.message}`);
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

        <h2 className="text-black text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit(SignIn_Submit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
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
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;

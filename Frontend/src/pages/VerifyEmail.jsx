"use client"

import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false); 

  useEffect(() => {
    if (hasVerified.current) return; 

    const token = searchParams.get("token");

    if (!token) {
      setMessage("❌ Invalid verification link. No token provided.");
      return;
    }

    // Mark that we are now attempting verification
    hasVerified.current = true; 

    axios.post(`http://localhost:8080/api/auth/verify`, { token: token })
      .then(res => {
        setMessage(`✅ ${res.data} Redirecting to login...`);
        setTimeout(() => {
          navigate("/auth"); 
        }, 3000);
      })
      .catch(err => {
        console.error(err);
        setMessage(err.response?.data || "❌ Verification failed. Please try again or sign up.");
      });

  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Account Verification</h2>
        <p className="text-lg text-gray-600">{message}</p>
        <button 
          onClick={() => navigate("/auth")} 
          className="mt-6 px-6 py-2 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default VerifyEmail;
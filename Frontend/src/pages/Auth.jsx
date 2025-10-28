"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CheckCircle, ArrowRight, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // ✅ Auto redirect if user is already logged in
  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"))
  if (storedUser?.token) {
    navigate("/dashboard")
  }
}, [navigate])

useEffect(() => {
  setMessage(""); // clear message when user switches tab
}, [activeTab]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

const [message, setMessage] = useState("");  // <-- new state for inline messages


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Extra check only for signup
      if (activeTab === "signup" && formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const endpoint =
        activeTab === "login"
          ? "http://localhost:8080/api/auth/login"
          : "http://localhost:8080/api/auth/signup";

      const payload =
        activeTab === "login"
          ? { email: formData.email, password: formData.password }
          : { name: formData.name, email: formData.email, password: formData.password };

      const response = await axios.post(endpoint, payload);

      console.log("✅ Success:", response.data);

      if (activeTab === "signup") {
        setMessage("Signup successful! Please check your email to verify your account.");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" }); // reset form
      } else {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("❌ Error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/auth");
  }

  const benefits = [
    "AI-powered resume optimization",
    "50+ professional templates",
    "Real-time ATS score checking",
    "Expert career guidance",
    "Unlimited downloads",
    "Priority support",
  ]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex min-h-screen">
        {/* Left Side - Benefits */}
        <div className="flex-col justify-center hidden p-12 lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-teal-600">
          <div className="max-w-md">
            <div className="flex items-center mb-8 space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">MyResuMate</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-white">Create Resumes That Get You Hired</h1>
            <p className="mb-8 text-xl text-white/90">
              Join 250,000+ professionals who've transformed their careers with our AI-powered platform.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 text-white" />
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="p-6 mt-8 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
              <div className="flex items-center space-x-4">
                <img src="/Dev image.jpg" alt="Success story" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="text-sm italic text-white/90">"MyResuMate helped me land my dream job at Google!"</p>
                  <p className="mt-1 text-xs text-white/70">- Dev Panchal, Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex flex-col items-center justify-start w-full p-8 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Tab Navigation */}
            <div className="flex p-1 mb-8 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "login" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "signup" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-8 text-center">
                <h2 className="mb-2 text-3xl font-bold gradient-text">
                  {activeTab === "login" ? "Welcome Back!" : "Get Started"}
                </h2>
                <p className="text-gray-600">
                  {activeTab === "login"
                    ? "Sign in to continue building amazing resumes"
                    : "Create your account and start building"}
                </p>

                {message && (
                  <div className="mb-4 p-3 text-sm text-blue-700 bg-blue-100 rounded">
                    {message}
                  </div>
                )}

              </div>

              {/* Name Field (Signup only) */}
              {activeTab === "signup" && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full py-3 pl-10 pr-4 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full py-3 pl-10 pr-4 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full py-3 pl-10 pr-12 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Signup only) */}
              {activeTab === "signup" && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full py-3 pl-10 pr-12 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Login Options */}
              {activeTab === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Terms Agreement (Signup only) */}
              {activeTab === "signup" && (
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-purple-600 hover:text-purple-700">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-600 hover:text-purple-700">
                      Privacy Policy
                    </a>
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" className="flex items-center justify-center w-full gap-2 py-4 text-lg btn-primary">
                {activeTab === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Logout Button (optional display) */}
              {JSON.parse(localStorage.getItem("user"))?.token && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full gap-2 py-2 mt-4 text-sm btn-secondary"
                >
                  Logout <LogOut className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth

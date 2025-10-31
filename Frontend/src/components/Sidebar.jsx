"use client"

import { useEffect, useState } from "react"
import { Link, useLocation,useNavigate } from "react-router-dom"
import {
  User,
  FileText,
  Layout,
  Shield,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageCircle,
} from "lucide-react"

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const [user, setUser] = useState(null)

const handleLogout = () => {
    // Clear all storage
    localStorage.clear();    // Clears "user" token and everything else
    sessionStorage.clear();  // Clears "draftResume" and everything else

    // Redirect to auth page
    navigate("/auth");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    setUser(storedUser)
  }, [])

  console.log("User from localStorage:", user)

  const menuItems = [
    { icon: <User className="w-6 h-6" />, label: "Profile", path: "/dashboard" },
    { icon: <FileText className="w-6 h-6" />, label: "Resume Builder", path: "/builder" },
    { icon: <Layout className="w-6 h-6" />, label: "Templates", path: "/templates" },
    { icon: <Shield className="w-6 h-6" />, label: "ATS Validator", path: "/ats" },
    { icon: <MessageCircle className="w-6 h-6" />, label: "Chatbot", path: "/chatbot" },
    { icon: <CreditCard className="w-6 h-6" />, label: "Subscription", path: "/pricing" },
    { icon: <Settings className="w-6 h-6" />, label: "Settings", path: "/settings" },
  ]

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">MyResuMate</span>
            </div>
          )}

          {/* <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 transition-colors rounded-lg hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button> */}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center flex-shrink-0 w-6 h-6">
                  {item.icon}
                </div>
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center p-3 space-x-3 transition-colors cursor-pointer rounded-xl hover:bg-gray-100">
          <img
            src="/Dev image.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {user?.user?.name || "Guest"}
              </div>
              <div className="text-xs text-gray-500">
                {user?.user?.premium ? "Premium User" : "Normal User"}
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
        <button onClick={handleLogout} className="flex items-center w-full p-3 mt-2 space-x-3 text-gray-700 transition-colors rounded-xl hover:bg-gray-100">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>

        )}
      </div>
    </div>
  )
}

export default Sidebar

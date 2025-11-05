"use client"

import { useState,useEffect } from "react"
import { Link } from "react-router-dom"
import { FileText, Download, Eye, Star, TrendingUp, Award, Plus, Clock, CheckCircle, Loader2 } from "lucide-react"
import Sidebar from "../components/Sidebar.jsx"
import AnimatedCounter from "../components/AnimatedCounter.jsx"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { formatDistanceToNow } from "date-fns"

const Dashboard = () => {
  const [recentResumes, setRecentResumes] = useState([])
  const [isLoadingResumes, setIsLoadingResumes] = useState(true)

   const [user, setUser] = useState(null)
    const navigate = useNavigate();
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"))
      if (!storedUser?.token) {
        navigate("/auth")
      } else {
        setUser(storedUser)
        fetchRecentResumes(storedUser.token) // ✅ Fetch resumes on load
      }
    }, [navigate])

    const fetchRecentResumes = async (token) => {
      setIsLoadingResumes(true);
      try {
        const response = await axios.get("http://localhost:8080/api/resumes/my-resumes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentResumes(response.data);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setIsLoadingResumes(false);
      }
    };

  const stats = [
    { label: "Resumes Created", value: 12, icon: <FileText className="w-6 h-6" />, color: "purple" },
    { label: "Downloads", value: 45, icon: <Download className="w-6 h-6" />, color: "pink" },
    { label: "Profile Views", value: 234, icon: <Eye className="w-6 h-6" />, color: "teal" },
    { label: "ATS Score Avg", value: 91, icon: <Star className="w-6 h-6" />, color: "green", suffix: "%" },
  ]

  const quickActions = [
    {
      title: "Create New Resume",
      description: "Start building a new resume from scratch",
      icon: <Plus className="w-8 h-8" />,
      link: "/builder?new=true",
      color: "purple",
    },
    {
      title: "Browse Templates",
      description: "Explore our collection of professional templates",
      icon: <FileText className="w-8 h-8" />,
      link: "/templates",
      color: "pink",
    },
    {
      title: "Check ATS Score",
      description: "Validate your resume against ATS systems",
      icon: <Award className="w-8 h-8" />,
      link: "/ats",
      color: "teal",
    },
  ]

  const recentActivity = [
    { action: "Downloaded resume", item: "Software Engineer Resume", time: "2 hours ago" },
    { action: "Updated profile", item: "Personal Information", time: "1 day ago" },
    { action: "Created resume", item: "Marketing Manager Resume", time: "2 days ago" },
    { action: "Checked ATS score", item: "Data Scientist Resume", time: "3 days ago" },
  ]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      
      <div className="flex">
        <div className="sticky w-64 h-screen overflow-y-auto bg-white shadow-lg top-16">
        {/* Sidebar */}
        <Sidebar className="sticky min-h-screen top-16"/>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold gradient-text">Welcome back, {user?.user?.name}!</h1>
              <p className="text-gray-600">Here's what's happening with your resumes today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-6 transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:shadow-xl hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        stat.color === "purple"
                          ? "bg-purple-100 text-purple-600"
                          : stat.color === "pink"
                            ? "bg-pink-100 text-pink-600"
                            : stat.color === "teal"
                              ? "bg-teal-100 text-teal-600"
                              : "bg-green-100 text-green-600"
                      }`}
                    >
                      {stat.icon}
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix || ""} />
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="p-6 transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:shadow-xl hover:scale-105 group"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                        action.color === "purple"
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700"
                          : action.color === "pink"
                            ? "bg-gradient-to-r from-pink-500 to-pink-600 group-hover:from-pink-600 group-hover:to-pink-700"
                            : "bg-gradient-to-r from-teal-500 to-teal-600 group-hover:from-teal-600 group-hover:to-teal-700"
                      } text-white transition-all duration-300`}
                    >
                      {action.icon}
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Recent Resumes */}
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Resumes</h2>
                  <Link to="/my-resumes" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {isLoadingResumes ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                  ) : recentResumes.length === 0 ? (
                    <p className="text-center text-gray-500">You haven't created any resumes yet.</p>
                  ) : (
                    recentResumes.slice(0, 3).map((resume) => (
                      <Link 
                        to={`/builder?resumeId=${resume.id}`} // ✅ Link to builder
                        key={resume.id}
                        className="flex items-center justify-between p-4 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{resume.resumeTitle}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{resume.templateName}</span>
                              <span>•</span>
                              {/* Format the date */}
                              <span>{formatDistanceToNow(new Date(resume.lastEdited), { addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">
                          <span className="font-medium">{activity.action}</span> {activity.item}
                        </p>
                        <div className="flex items-center mt-1 space-x-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

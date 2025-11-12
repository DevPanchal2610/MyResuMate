// src/pages/MyResumes.jsx
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { FileText, Loader2, Plus, Trash2  } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import { formatDistanceToNow } from "date-fns"
import Sidebar from "../components/Sidebar.jsx" // Adjust path if needed

const MyResumes = () => {
  const [allResumes, setAllResumes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (!storedUser?.token) {
      navigate("/auth")
    } else {
      setUser(storedUser)
      fetchAllResumes(storedUser.token)
    }
  }, [navigate])

  const fetchAllResumes = async (token) => {
    setIsLoading(true)
    try {
      // Use the same endpoint as your dashboard
      const response = await axios.get("http://localhost:8080/api/resumes/my-resumes", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllResumes(response.data) // Here we store all of them
    } catch (error) {
      console.error("Failed to fetch resumes:", error)
    } finally {
      setIsLoading(false)
    }
  }

 const handleDeleteResume = async (resumeId) => {
  const result = await Swal.fire({
    title: "Delete Resume?",
    text: "Are you sure you want to delete this resume? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9333ea", // Purple
    cancelButtonColor: "#ec4899", 
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    background: "#fff",
    color: "#111827",
    customClass: {
      popup: "rounded-2xl shadow-lg border border-gray-200",
      title: "text-xl font-bold",
      confirmButton: "px-4 py-2 rounded-lg",
      cancelButton: "px-4 py-2 rounded-lg",
    },
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8080/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      Swal.fire({
        title: "Deleted!",
        text: "Your resume has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
        background: "#fff",
      });
      fetchAllResumes(user.token);
    } catch (error) {
      console.error("Failed to delete resume:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the resume. Please try again.",
        icon: "error",
        confirmButtonColor: "#9333ea",
        background: "#fff",
      });
    }
  }
};


  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex">
        <div className="sticky w-64 h-screen overflow-y-auto bg-white shadow-lg top-16">
          <Sidebar className="sticky min-h-screen top-16"/>
        </div>

        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold gradient-text">My Resumes</h1>
            <Link
              to="/builder?new=true"
              className="flex items-center gap-2 px-4 py-2 text-white transition-all bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 hover:scale-105"
            >
              <Plus size={18} />
              Create New
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            </div>
          ) : allResumes.length === 0 ? (
            <div className="text-center bg-white p-10 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700">No Resumes Found</h3>
              <p className="text-gray-500 mt-2">Get started by creating your first resume!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Here we map ALL resumes, not just 3 */}
              {allResumes.map((resume) => (
  <div
    key={resume.id}
    className="relative block p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl hover:scale-105 transition-all"
  >
    <Link
      to={`/builder?resumeId=${resume.id}`}
      className="flex items-center space-x-4 mb-4"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
        <FileText className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 truncate">{resume.resumeTitle}</h3>
        <span className="text-sm text-gray-600">{resume.templateName}</span>
      </div>
    </Link>

    <p className="text-sm text-gray-500 mb-2">
      Last edited: {formatDistanceToNow(new Date(resume.lastEdited), { addSuffix: true })}
    </p>

    {/* Delete Button (top-right corner) */}
    <button
      onClick={() => handleDeleteResume(resume.id)}
      className="absolute top-3 right-3 p-2 text-red-500 rounded-full hover:bg-red-100 transition-all duration-200"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  </div>
))}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyResumes
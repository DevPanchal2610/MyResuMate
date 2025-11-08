"use client"

import { useState, useRef } from "react"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Zap,
  Target,
  Award,
} from "lucide-react"
import Sidebar from "../components/Sidebar.jsx"
import AnimatedCounter from "../components/AnimatedCounter.jsx"

const ATS = () => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const fileInputRef = useRef(null)

  const getScoreGrade = (score) => {
    if (score >= 90) return { grade: "Excellent", color: "text-green-500" };
    if (score >= 80) return { grade: "Great", color: "text-emerald-500" };
    if (score >= 70) return { grade: "Good", color: "text-sky-500" };
    if (score >= 60) return { grade: "Fair", color: "text-yellow-500" };
    return { grade: "Needs Improvement", color: "text-red-500" };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
      setIsAnalyzing(true)
      setAnalysisResult(null)

      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("http://localhost:8080/api/ats/analyze", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to analyze resume: ${errorBody}`)
        }

        const data = await response.json()
        
        const { atsScore, feedbackItems, aiSuggestions } = data;
        const { grade, color } = getScoreGrade(atsScore);

        const issues = feedbackItems || [];

        const strengths = feedbackItems
          ?.filter(item => item.type === 'GOOD_PRACTICE')
          .map(item => item.message) || [];

        const improvements = aiSuggestions || [];

        setAnalysisResult({
          atsScore,
          grade,
          gradeColor: color,
          issues,
          strengths,
          improvements,
          raw: data,
        });

      } catch (error) {
        console.error("Error analyzing resume:", error)
        alert("Something went wrong while analyzing the resume. Please check the console for details.")
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const handleDragOver = (e) => e.preventDefault()

  const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload({ target: { files: [files[0]] } })
    }
  }

  const resetAnalysis = () => {
    setUploadedFile(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex">
        <div className="sticky top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-white shadow-lg">
          <Sidebar className="min-h-full" />
        </div>

        <div className="flex-1">
          <div className="max-w-6xl px-8 py-12 mx-auto">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold gradient-text">ATS Resume Validator</h1>
              <p className="max-w-3xl mx-auto text-xl text-gray-600">
                Upload your resume and get instant feedback on how well it will perform with Applicant Tracking Systems.
                Our AI analyzes your resume and provides actionable suggestions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
               <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold gradient-text">
                    <AnimatedCounter end={95} suffix="%" />
                  </div>
                  <p className="text-gray-600">Average ATS Pass Rate</p>
                </div>
                <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold gradient-text">
                    <AnimatedCounter end={50000} suffix="+" />
                  </div>
                  <p className="text-gray-600">Resumes Analyzed</p>
                </div>
                <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold gradient-text">
                    {/* The new AnimatedCounter now handles decimals gracefully */}
                    <AnimatedCounter end={3.9} suffix="/5" decimals={1} />
                  </div>
                  <p className="text-gray-600">User Satisfaction</p>
                </div>
            </div>

            {!analysisResult && !isAnalyzing && (
              <div className="p-8 bg-white shadow-lg rounded-2xl">
                <div
                  className="p-12 text-center transition-colors border-2 border-gray-300 border-dashed cursor-pointer rounded-2xl hover:border-purple-400"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
                    <Upload className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Upload Your Resume</h3>
                  <p className="max-w-md mx-auto mb-6 text-gray-600">
                    Drag and drop your resume here, or click to browse. We support PDF format.
                  </p>
                  <button className="btn-primary">Choose File</button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="p-8 text-center bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Analyzing Your Resume</h3>
                <p className="mb-6 text-gray-600">
                  Our AI is scanning your resume for content, structure, and ATS compatibility...
                </p>
                 <div className="w-full max-w-md h-2 mx-auto overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-8 animate-fade-in">
                <div className="p-8 bg-white shadow-lg rounded-2xl">
                  <div className="mb-8 text-center">
                    <div className={`relative flex items-center justify-center w-40 h-40 mx-auto mb-6 rounded-full bg-slate-50`}>
                        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                            <circle className={`${analysisResult.gradeColor}`} strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * analysisResult.atsScore) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}/>
                        </svg>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-800">
                                <AnimatedCounter end={analysisResult.atsScore} />
                            </div>
                            <div className="text-sm text-gray-500">ATS Score</div>
                        </div>
                    </div>
                    <h3 className={`mb-2 text-3xl font-bold ${analysisResult.gradeColor}`}>{analysisResult.grade}</h3>
                    <p className="text-gray-600">
                      Based on our analysis, your resume has an estimated {analysisResult.atsScore}% compatibility score.
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button onClick={resetAnalysis} className="btn-secondary">
                      Analyze Another Resume
                    </button>
                  </div>
                </div>

                <div className="p-8 bg-white shadow-lg rounded-2xl">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Detailed ATS Breakdown</h3>
                  <div className="space-y-4">
                    {analysisResult.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-l-4 ${
                          issue.type === "CRITICAL_ISSUE"
                            ? "bg-red-50 border-red-500"
                            : issue.type === "IMPROVEMENT"
                            ? "bg-yellow-50 border-yellow-500"
                            : "bg-green-50 border-green-500"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {issue.type === "CRITICAL_ISSUE" && <XCircle className="w-5 h-5 text-red-500" />}
                            {issue.type === "IMPROVEMENT" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                            {issue.type === "GOOD_PRACTICE" && <CheckCircle className="w-5 h-5 text-green-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{issue.category}</span>
                            </div>
                            <p className="text-gray-700">{issue.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="p-8 bg-white shadow-lg rounded-2xl">
                    <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-8 bg-white shadow-lg rounded-2xl">
                    <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900">
                      <Zap className="w-6 h-6 text-purple-500" />
                      AI-Powered Suggestions
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-3">
                           <div className="flex-shrink-0 w-2 h-2 mt-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ATS

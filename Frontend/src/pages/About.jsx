"use client"

import { Cpu, ShieldCheck, LayoutGrid, CheckCircle, Rocket } from "lucide-react"
import { Link } from "react-router-dom" // Use Link for navigation
import Sidebar from "../components/Sidebar.jsx"
import ParallaxSection from "../components/ParallaxSection.jsx"

// ====================================================================
// ✅ HELPER: Feature Card Component
// ====================================================================
const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="p-8 text-center bg-white shadow-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
    <div
      className={`w-20 h-20 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
    >
      <div className="text-white">{icon}</div>
    </div>
    <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

// ====================================================================
// ✅ HELPER: Timeline Step Component
// ====================================================================
const TimelineStep = ({ icon, title, description, isLast = false }) => (
  <li className="relative flex-1 pb-8">
    {!isLast && (
      <div className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-purple-200" aria-hidden="true" />
    )}
    <div className="relative flex items-start space-x-4">
      <div>
        <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  </li>
)

// ====================================================================
// ✅ MAIN: About Component
// ====================================================================
const About = () => {
  const features = [
    {
      icon: <Cpu className="w-10 h-10" />,
      title: "AI-Powered Content",
      description: "Our AI helps you craft compelling bullet points and summaries that catch recruiter attention.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <ShieldCheck className="w-10 h-10" />,
      title: "Real-Time ATS Checker",
      description: "Instantly score your resume against real Applicant Tracking Systems to optimize your keywords.",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      icon: <LayoutGrid className="w-10 h-10" />,
      title: "Professional Templates",
      description: "Choose from dozens of templates approved by recruiters and designed to be ATS-friendly.",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  const timeline = [
    {
      icon: <CheckCircle className="w-4 h-4 text-white" />,
      title: "Choose Your Template",
      description: "Select a professionally designed, ATS-friendly template that fits your industry and style.",
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-white" />,
      title: "Build with AI Assist",
      description: "Our builder guides you section-by-section, with AI suggestions to perfect your content.",
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-white" />,
      title: "Optimize with ATS Score",
      description: "Use our validator to check your resume's score and get actionable feedback instantly.",
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-white" />,
      title: "Download & Apply",
      description: "Export your new resume as a PDF and apply for your dream job with confidence.",
    },
  ]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex">
        <div className="sticky w-64 h-screen overflow-y-auto bg-white shadow-lg top-16">
          <Sidebar className="sticky min-h-screen top-16" />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <ParallaxSection
            speed={0.5}
            className="py-20 text-white bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600"
          >
            <div className="max-w-6xl px-8 mx-auto text-center">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">Our Mission: Your Success.</h1>
              <p className="max-w-3xl mx-auto mb-8 text-xl">
                Job searching is broken. We built MyResuMate to fix it. We believe everyone
                deserves a fair chance, not just those who know how to beat the "resume robots."
              </p>
            </div>
          </ParallaxSection>

          <div className="px-8 py-16 mx-auto max-w-7xl">
            {/* Our Mission Section */}
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold gradient-text">
                Leveling the Playing Field
              </h2>
              <p className="text-lg text-gray-700">
                Did you know over 75% of resumes are rejected by an Applicant Tracking System (ATS)
                before a human ever sees them? MyResuMate was born from this frustrating reality.
                Our mission is to democratize career success by giving you the exact tools
                recruiters use, so you can build a resume that not only looks stunning but
                gets you in the door.
              </p>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 gap-8 mb-20 md:grid-cols-3">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  gradient={feature.gradient}
                />
              ))}
            </div>

            {/* How It Works Section */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="p-8 bg-white shadow-lg rounded-2xl">
                <h2 className="mb-8 text-3xl font-bold gradient-text">
                  Get Hired in 4 Simple Steps
                </h2>
                <ol className="relative flex flex-col">
                  {timeline.map((step, index) => (
                    <TimelineStep
                      key={index}
                      icon={step.icon}
                      title={step.title}
                      description={step.description}
                      isLast={index === timeline.length - 1}
                    />
                  ))}
                </ol>
              </div>
              
              <div className="flex items-center justify-center p-8 text-white bg-gradient-to-br from-purple-600 to-teal-500 rounded-2xl">
                <div className="text-center">
                  <Rocket className="w-24 h-24 mx-auto mb-6" />
                  <h3 className="mb-4 text-3xl font-bold">Launch Your Career</h3>
                  <p className="mb-8 text-lg opacity-90">
                    Stop guessing and start applying. Our platform provides everything you need
                    to build a resume that truly represents your skills and potential.
                  </p>
                  <Link to="/builder?new=true" className="btn-light">
                    Start Building Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <ParallaxSection
            speed={0.3}
            className="py-20 mt-16 text-center text-gray-900 bg-white"
          >
            <div className="max-w-4xl px-8 mx-auto">
              <h2 className="mb-6 text-4xl font-bold gradient-text">
                Ready to land your dream job?
              </h2>
              <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-700">
                Join thousands of successful job seekers. Create your professional,
                ATS-optimized resume today.
              </p>
              <Link to="/templates" className="btn-primary">
                Choose Your Template
              </Link>
            </div>
          </ParallaxSection>
        </div>
      </div>
    </div>
  )
}

export default About
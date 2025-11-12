"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Sparkles, Zap, Shield, Target, Award, CheckCircle, Star, Download, Eye } from "lucide-react"
import Hero3D from "../components/Hero3D.jsx"
import ParallaxSection from "../components/ParallaxSection.jsx"
import AnimatedCounter from "../components/AnimatedCounter.jsx"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const Home = () => {
  const heroRef = useRef()
  const featuresRef = useRef()
  const statsRef = useRef()
  const testimonialsRef = useRef()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Hero animations
    const heroTl = gsap.timeline({ delay: 0.5 })
    heroTl
      .fromTo(".hero-title", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
      .fromTo(".hero-subtitle", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .fromTo(".hero-buttons", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3")

    // Features reveal animation
    gsap.fromTo(
      ".feature-card",
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Stats animation
    gsap.fromTo(
      ".stat-card",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Testimonials animation
    gsap.fromTo(
      ".testimonial-card",
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Builder",
      description:
        "Create professional resumes in minutes with our intelligent resume builder that adapts to your industry.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems with our advanced ATS validation technology.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Industry Templates",
      description: "Choose from 50+ professionally designed templates tailored for different industries and roles.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expert Guidance",
      description: "Get real-time suggestions and tips from career experts to make your resume stand out.",
    },
  ]

  const stats = [
    { number: 250000, suffix: "+", label: "Resumes Created" },
    { number: 95, suffix: "%", label: "ATS Pass Rate" },
    { number: 180000, suffix: "+", label: "Jobs Landed" },
    { number: 3.9, suffix: "/5", label: "User Rating" },
  ]

  const testimonials = [
    {
      name: "Dev Panchal",
      role: "Software Engineer",
      company: "Google",
      content: "MyResuMate helped me land my dream job at Google! The ATS feature was a game-changer.",
      avatar: "/Dev image.jpg",
    },
    {
      name: "Vyom Chauhan",
      role: "Marketing Manager",
      company: "Meta",
      content: "The templates are stunning and the AI suggestions helped me highlight my achievements perfectly.",
      avatar: "/vyom.jpg",
    },
    {
      name: "Juhil Mistry",
      role: "Data Scientist",
      company: "Netflix",
      content: "I got 3x more interview calls after using MyResuMate. The difference was incredible!",
      avatar: "/Juhil.JPG",
    },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Hero3D className="w-full h-full" />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-teal-900/20 z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <h1 className="hero-title text-5xl md:text-7xl font-bold gradient-text mb-6 text-balance">
            Create Resumes That Get You
            <span className="block text-transparent bg-gradient-to-r from-pink-500 to-teal-500 bg-clip-text">
              Hired Faster
            </span>
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto text-pretty">
            Build ATS-optimized resumes with our AI-powered platform. Join 250,000+ professionals who've landed their
            dream jobs.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/builder" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Build My Resume
            </Link>
            <Link to="/ats" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Check ATS Score
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>ATS-optimized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-purple-50 via-pink-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Why Choose MyResuMate?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with expert career guidance to help you create resumes
              that stand out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ParallaxSection key={index} speed={0.3}>
                <div className="feature-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </ParallaxSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600">See how MyResuMate helped professionals land their dream jobs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their careers with MyResuMate. Start building your
            perfect resume today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/builder"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Start Building Now
            </Link>
            <Link
              to="/templates"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View Templates
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

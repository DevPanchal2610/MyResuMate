"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Headphones, Loader2 } from "lucide-react"
import Sidebar from "../components/Sidebar.jsx"
import ParallaxSection from "../components/ParallaxSection.jsx"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      setUser(storedUser);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError(""); // Clear error on new input
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("") // Clear old errors
    
    try {
      // 1. Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };
      // If user is logged in, add their token
      if (user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }

      // 2. Send data to your Spring Boot API
      await axios.post(
        "http://localhost:8080/api/contact/submit",
        formData,
        { headers: headers }
      );

      // 3. Handle success
      setIsSubmitting(false)
      setSubmitted(true)
    } catch (err) {
      // 4. Handle error
      console.error("Contact form submission failed:", err)
      setError("Failed to send message. Please check your details or try again later.")
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@myresumate.com",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      description: "Chat with our support team instantly",
      contact: "Available 9 AM - 6 PM EST",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: "+91 93165-10025",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create my first resume?",
          answer:
            "Simply sign up for a free account, choose a template, and start filling in your information using our step-by-step builder.",
        },
        {
          question: "Can I use MyResuMate for free?",
          answer:
            "Yes! Our free plan includes 1 basic template, resume builder, and PDF download. Perfect for getting started.",
        },
        {
          question: "How long does it take to create a resume?",
          answer:
            "Most users complete their first resume in 15-30 minutes using our guided builder and pre-written suggestions.",
        },
      ],
    },
    {
      category: "Features & Plans",
      questions: [
        {
          question: "What's the difference between free and premium?",
          answer:
            "Premium includes 50+ templates, unlimited resumes, ATS optimization, cover letter builder, and priority support.",
        },
        {
          question: "How does ATS optimization work?",
          answer:
            "Our AI analyzes your resume against real ATS systems, checking keywords, formatting, and structure to maximize pass rates.",
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer:
            "Yes, you can cancel anytime. You'll keep access to premium features until the end of your billing period.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "My resume won't download. What should I do?",
          answer:
            "Try refreshing the page and downloading again. If the issue persists, contact our support team for assistance.",
        },
        {
          question: "Can I edit my resume after downloading?",
          answer:
            "Yes, your resume is saved in your account and can be edited anytime. Premium users can export to Word for external editing.",
        },
        {
          question: "Is my data secure?",
          answer:
            "Absolutely. We use enterprise-grade security, SSL encryption, and never share your personal information with third parties.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex">
       <div className="sticky w-64 h-screen overflow-y-auto bg-white shadow-lg top-16">
          {/* Sidebar */}
          <Sidebar className="sticky min-h-screen top-16" />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Hero Section */}
          <ParallaxSection
            speed={0.5}
            className="py-16 text-white bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600"
          >
            <div className="max-w-6xl px-8 mx-auto text-center">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">Get Help & Support</h1>
              <p className="max-w-3xl mx-auto mb-8 text-xl">
                We're here to help you succeed. Reach out to our support team or browse our FAQ for quick answers.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-5 h-5" />
                  <span>24/7 Support Available</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Headphones className="w-5 h-5" />
                  <span>Average Response: 2 hours</span>
                </div>
              </div>
            </div>
          </ParallaxSection>

          <div className="px-8 py-12 mx-auto max-w-7xl">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-3">
              {contactMethods.map((method, index) => (
                <div key={index} className="p-8 text-center bg-white shadow-lg rounded-2xl card-hover">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <div className="text-white">{method.icon}</div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">{method.title}</h3>
                  <p className="mb-4 text-gray-600">{method.description}</p>
                  <p className="font-semibold text-gray-900">{method.contact}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="p-8 bg-white shadow-lg rounded-2xl">
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold gradient-text">Send us a Message</h2>
                  <p className="text-gray-600">
                    Have a specific question or need personalized help? Fill out the form below and we'll get back to
                    you soon.
                  </p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="general">General Question</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Please provide as much detail as possible..."
                      />
                    </div>
                      {error && (
                      <div className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-xl">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full btn-primary flex items-center justify-center gap-2 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="py-12 text-center">
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
                      <Send className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">Message Sent!</h3>
                    <p className="mb-6 text-gray-600">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({ name: "", email: "", subject: "", message: "", category: "general" })
                      }}
                      className="btn-secondary"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="space-y-8">
                <div className="p-8 bg-white shadow-lg rounded-2xl">
                  <h3 className="mb-6 text-xl font-bold gradient-text">Our Office</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="flex-shrink-0 w-6 h-6 mt-1 text-purple-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Address</p>
                        <p className="text-gray-600">
                          1302 Shilp Corporate Park,<br />
                          Ahemdabad, Gujarat- 380051
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="flex-shrink-0 w-6 h-6 mt-1 text-purple-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Business Hours</p>
                        <p className="text-gray-600">
                          Monday - Friday: 9:00 AM - 6:00 PM PST
                          <br />
                          Saturday - Sunday: 10:00 AM - 4:00 PM PST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
                  <h3 className="mb-4 text-xl font-bold">Need Immediate Help?</h3>
                  <p className="mb-6 opacity-90">
                    For urgent issues or premium support, our live chat is available 24/7 for premium users.
                  </p>
                  <button className="px-6 py-3 font-semibold text-purple-600 transition-colors bg-white hover:bg-gray-100 rounded-xl">
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold gradient-text">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600">Find quick answers to common questions</p>
              </div>

              <div className="space-y-8">
                {faqs.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="p-8 bg-white shadow-lg rounded-2xl">
                    <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900">
                      <HelpCircle className="w-6 h-6 text-purple-600" />
                      {category.category}
                    </h3>
                    <div className="space-y-6">
                      {category.questions.map((faq, faqIndex) => (
                        <div key={faqIndex} className="pl-6 border-l-4 border-purple-200">
                          <h4 className="mb-2 font-semibold text-gray-900">{faq.question}</h4>
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader } from "lucide-react"
import Sidebar from "../components/Sidebar.jsx"
import MarkdownRenderer from "../components/MarkdownRenderer.jsx"

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋! Paste your resume content and tell me the job role. I'll help you optimize it for ATS and recruiters." }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  // --- FIX 1: Remove the old ref for the bottom div ---
  // const messagesEndRef = useRef(null)

  // --- FIX 2: Create a new ref for the scrollable message container itself ---
  const scrollContainerRef = useRef(null);


  // --- FIX 3: Replace the old useEffect with a more precise one ---
  useEffect(() => {
    // This function now scrolls the container, not the whole window
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]); // This still runs whenever a new message is added

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/api/chat/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error: ${errorText}`)
      }

      const data = await response.json()
      const botMessage = { sender: "bot", text: data.reply || "No response received." }
      setMessages((prev) => [...prev, botMessage])

    } catch (error) {
      console.error("Chatbot API error:", error)
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Something went wrong. Please try again later." }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="sticky top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-white shadow-lg">
          <Sidebar className="min-h-full" />
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="max-w-5xl px-8 py-12 mx-auto">
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-4xl font-bold gradient-text">AI Resume Assistant</h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Chat with our AI to improve your resume content. Get ATS-friendly feedback, 
                suggestions tailored for specific job roles, and optimization tips.
              </p>
            </div>

            {/* Chat Window */}
            <div className="p-6 bg-white shadow-lg rounded-2xl h-[600px] flex flex-col">
              {/* --- FIX 4: Attach the ref to the scrollable div --- */}
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-xl max-w-[70%] ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                        {msg.sender === "bot" ? (
                          <MarkdownRenderer content={msg.text} />
                        ) : (
                          msg.text
                        )}
                    </div>
                    {msg.sender === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="p-3 rounded-xl bg-gray-100 text-gray-600 flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}
                    {/* --- FIX 5: We no longer need the empty div at the bottom --- */}
                {/* <div ref={messagesEndRef} /> */}
              </div>

              {/* Input Box */}
              <div className="mt-4 flex items-center gap-2">
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste resume content or ask about a job role..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
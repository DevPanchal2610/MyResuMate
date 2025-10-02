"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Sparkles } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Templates", path: "/templates" },
    { name: "ATS Validator", path: "/ats" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    // <nav
    //   className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    //     scrolled ? "glass-effect shadow-lg" : "bg-transparent"
    //   }`}
    // >
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-lg glass-effect">

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MyResuMate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path ? "text-purple-600" : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/auth" className="text-sm btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 transition-colors hover:text-purple-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 mt-2 space-y-1 rounded-lg glass-effect">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    location.pathname === link.path
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/auth" className="block w-full mt-4 text-center btn-primary" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

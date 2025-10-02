import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SmoothScrollProvider from "./components/SmoothScrollProvider.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"

// Pages
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Auth from "./pages/Auth.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Builder from "./pages/Builder.jsx"
import Templates from "./pages/Templates.jsx"
import ATS from "./pages/ATS.jsx"
import Chatbot from "./pages/Chatbot.jsx"
import Pricing from "./pages/Pricing.jsx"
import Contact from "./pages/Contact.jsx"

function App() {
  return (
    <Router>
      <SmoothScrollProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/ats" element={<ATS />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SmoothScrollProvider>
    </Router>
  )
}

export default App

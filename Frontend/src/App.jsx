import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import SmoothScrollProvider from "./components/SmoothScrollProvider.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import ResetPassword from "./components/ResetPassword";

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
import NotFound from "./pages/NotFound.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx";

// ✅ Protected Route Component
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"))
  return user?.token ? children : <Navigate to="/auth" replace  />
}

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
              <Route path="/reset-password" element={<ResetPassword />} /> 
               <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/builder"
                element={
                  <PrivateRoute>
                    <Builder />
                  </PrivateRoute>
                }
              />
              <Route
                path="/templates"
                element={
                  <PrivateRoute>
                    <Templates />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ats"
                element={
                  <PrivateRoute>
                    <ATS />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <PrivateRoute>
                    <Chatbot />
                  </PrivateRoute>
                }
              />
              <Route path="/verify" element={<VerifyEmail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SmoothScrollProvider>
    </Router>
  )
}

export default App

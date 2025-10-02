"use client"
import Sidebar from "../components/Sidebar"   
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Check, Crown, Zap, Star, Users, Headphones, Shield, Home, Briefcase, Mail, Settings, Bell, ChevronDown } from "lucide-react"


const ParallaxSection = ({ children, speed, className }) => {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`relative ${className}`} style={{ transform: `translateY(${offsetY * speed}px)` }}>
      {children}
    </div>
  );
};

// Self-contained AnimatedCounter component
const AnimatedCounter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = 0;
    const duration = 2000;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const increment = (end / duration) * progress;
      const newCount = Math.min(increment, end);

      setCount(Math.floor(newCount));
      if (newCount < end) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return (
    <span>{count}{suffix}</span>
  );
};

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started with resume building",
      price: { monthly: 0, yearly: 0 },
      popular: false,
      features: ["1 resume template", "Basic resume builder", "PDF download", "Email support", "Basic ATS checker"],
      limitations: ["Limited to 1 resume", "Watermark on downloads", "Basic templates only", "Standard support"],
      cta: "Get Started Free",
      gradient: "from-gray-500 to-gray-600",
      bgGradient: "from-gray-50 to-gray-100",
    },
    {
      name: "Premium",
      description: "Everything you need to land your dream job",
      price: { monthly: 19, yearly: 15 },
      popular: true,
      features: [
        "50+ premium templates",
        "Advanced resume builder",
        "Unlimited resumes",
        "No watermarks",
        "Advanced ATS optimization",
        "Cover letter builder",
        "LinkedIn optimization",
        "Priority support",
        "Resume analytics",
        "Export to multiple formats",
      ],
      limitations: [],
      cta: "Start Premium Trial",
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      name: "Professional",
      description: "For career coaches and professionals",
      price: { monthly: 39, yearly: 31 },
      popular: false,
      features: [
        "Everything in Premium",
        "White-label solution",
        "Client management",
        "Team collaboration",
        "Advanced analytics",
        "Custom branding",
        "API access",
        "Dedicated support",
        "Training sessions",
        "Custom integrations",
      ],
      limitations: [],
      cta: "Contact Sales",
      gradient: "from-teal-600 to-cyan-600",
      bgGradient: "from-teal-50 to-cyan-50",
    },
  ]

  const features = [
    {
      category: "Resume Building",
      items: [
        { name: "Resume Templates", free: "1 basic", premium: "50+ premium", professional: "All + custom" },
        { name: "Resume Builder", free: "Basic", premium: "Advanced", professional: "Advanced + AI" },
        { name: "Number of Resumes", free: "1", premium: "Unlimited", professional: "Unlimited" },
        { name: "Export Formats", free: "PDF", premium: "PDF, Word, TXT", professional: "All formats" },
      ],
    },
    {
      category: "ATS & Optimization",
      items: [
        { name: "ATS Score", free: "Basic", premium: "Advanced", professional: "Enterprise" },
        { name: "Keyword Optimization", free: "❌", premium: "✅", professional: "✅ + AI" },
        { name: "Industry Insights", free: "❌", premium: "✅", professional: "✅ + Custom" },
        { name: "Real-time Feedback", free: "❌", premium: "✅", professional: "✅ + Analytics" },
      ],
    },
    {
      category: "Support & Features",
      items: [
        { name: "Support", free: "Email", premium: "Priority", professional: "Dedicated" },
        { name: "Cover Letters", free: "❌", premium: "✅", professional: "✅ + Templates" },
        { name: "LinkedIn Optimization", free: "❌", premium: "✅", professional: "✅ + Analytics" },
        { name: "Team Collaboration", free: "❌", premium: "❌", professional: "✅" },
      ],
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content: "MyResuMate Premium helped me land my dream job at Google. The ATS optimization was incredible!",
      avatar: "/professional-woman-smiling.png",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Marketing Director",
      company: "Meta",
      content: "The premium templates are stunning and the analytics helped me understand what works.",
      avatar: "/professional-man-smiling.png",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Career Coach",
      company: "CareerPro",
      content: "Professional plan is perfect for my coaching business. My clients love the results!",
      avatar: "/professional-woman-glasses.png",
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.",
    },
    {
      question: "What's included in the free plan?",
      answer:
        "The free plan includes 1 basic template, basic resume builder, PDF download, and email support. Perfect for trying out our platform.",
    },
    {
      question: "How does the ATS optimization work?",
      answer:
        "Our AI analyzes your resume against real ATS systems, checking for keywords, formatting, and structure to maximize your chances of getting through initial screening.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
    },
  ]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex ">
        <div className="sticky w-64 h-screen overflow-y-auto bg-white shadow-lg top-16">
          {/* Sidebar */}
          <Sidebar className="sticky min-h-screen top-16" />
        </div>

        {/* Main Content */}
        <div className="flex-1 ">
          {/* Hero Section */}
          <ParallaxSection
            speed={0.5}
            className="py-16 text-white bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600"
          >
            <div className="max-w-6xl px-8 mx-auto text-center">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">Choose the Right Plan</h1>
              <p className="max-w-3xl mx-auto mb-8 text-xl">
                Start for free and upgrade when you're ready. All plans include our core resume building features.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className={`font-medium ${billingCycle === "monthly" ? "text-white" : "text-white/70"}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    billingCycle === "yearly" ? "bg-white/30" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      billingCycle === "yearly" ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`font-medium ${billingCycle === "yearly" ? "text-white" : "text-white/70"}`}>
                  Yearly
                </span>
              </div>
              
              {/* This container ensures space is always maintained */}
              <div className="flex items-center justify-center h-8 mb-8 text-center">
                <span className={`px-4 py-2 text-base font-bold text-yellow-900 bg-yellow-300 rounded-full inline-block transition-opacity duration-300 ${billingCycle === "yearly" ? 'opacity-100' : 'opacity-0'}`}>
                  Save 20% 
                </span>
              </div>
            </div>
          </ParallaxSection>

          <div className="px-8 py-12 mx-auto max-w-7xl">
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 gap-8 mb-16 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                    plan.popular ? "ring-4 ring-purple-500 ring-opacity-50" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 py-2 text-sm font-bold text-center text-white bg-gradient-to-r from-purple-600 to-pink-600">
                      <Star className="inline w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  )}

                  <div className={`bg-gradient-to-br ${plan.bgGradient} p-8 ${plan.popular ? "pt-12" : ""}`}>
                    <div className="mb-6 text-center">
                      <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="mb-4 text-gray-600">{plan.description}</p>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">${plan.price[billingCycle]}</span>
                        <span className="ml-1 text-gray-600">/{billingCycle === "monthly" ? "month" : "year"}</span>
                      </div>
                    </div>

                    <Link
                      to={plan.name === "Free" ? "/auth" : "/auth"}
                      className={`w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 mb-2 bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white`}
                    >
                      {plan.name === "Free" ? <Zap className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                      {plan.cta}
                    </Link>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Comparison */}
            <div className="mb-16 overflow-hidden bg-white shadow-lg rounded-2xl">
              <div className="p-8 text-center text-white bg-gradient-to-r from-purple-600 to-pink-600">
                <h2 className="mb-4 text-3xl font-bold">Detailed Feature Comparison</h2>
                <p className="text-xl opacity-90">See what's included in each plan</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-6 font-semibold text-left text-gray-900">Features</th>
                      <th className="p-6 font-semibold text-center text-gray-900">Free</th>
                      <th className="p-6 font-semibold text-center text-purple-600">Premium</th>
                      <th className="p-6 font-semibold text-center text-teal-600">Professional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((category, categoryIndex) => (
                      <>
                        <tr key={`category-${categoryIndex}`} className="bg-gray-100">
                          <td colSpan={4} className="p-4 font-bold text-gray-900">
                            {category.category}
                          </td>
                        </tr>
                        {category.items.map((item, itemIndex) => (
                          <tr key={`item-${categoryIndex}-${itemIndex}`} className="border-b border-gray-200">
                            <td className="p-4 text-gray-700">{item.name}</td>
                            <td className="p-4 text-center text-gray-600">{item.free}</td>
                            <td className="p-4 font-medium text-center text-purple-600">{item.premium}</td>
                            <td className="p-4 font-medium text-center text-teal-600">{item.professional}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-4">
              <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold gradient-text">
                  <AnimatedCounter end={250000} suffix="+" />
                </div>
                <p className="text-gray-600">Happy Users</p>
              </div>
              <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold gradient-text">
                  <AnimatedCounter end={95} suffix="%" />
                </div>
                <p className="text-gray-600">Success Rate</p>
              </div>
              <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold gradient-text">
                  <AnimatedCounter end={4.9} suffix="/5" />
                </div>
                <p className="text-gray-600">User Rating</p>
              </div>
              <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold gradient-text">24/7</div>
                <p className="text-gray-600">Support</p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-16">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold gradient-text">What Our Users Say</h2>
                <p className="text-xl text-gray-600">
                  Join thousands of professionals who have transformed their careers
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-8 bg-white shadow-lg rounded-2xl">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="mb-6 italic text-gray-700">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 mr-4 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="p-8 bg-white shadow-lg rounded-2xl">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold gradient-text">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600">Have questions? We have answers.</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
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

export default Pricing

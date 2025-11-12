"use client"
import Sidebar from "../components/Sidebar"   
import { useState, useEffect } from "react"
// ✅ Added useNavigate
import { Link, useNavigate, useLocation } from "react-router-dom"
// ✅ Added axios
import axios from "axios"
// ✅ Added Loader2, AlertCircle, XCircle
import { Check, Crown, Zap, Star, Users, Headphones, Shield, Home, Briefcase, Mail, Settings, Bell, ChevronDown, Loader2, AlertCircle, XCircle } from "lucide-react"


const ParallaxSection = ({ children, speed, className }) => {
  // ... (code is correct) ...
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
  // ... (code is correct) ...
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

// ✅ HELPER: Component to show page messages
const PageMessage = ({ message, type, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-100' : 'bg-yellow-100';
  const borderColor = isError ? 'border-red-400' : 'border-yellow-400';
  const textColor = isError ? 'text-red-700' : 'text-yellow-700';
  const Icon = isError ? XCircle : AlertCircle;

  return (
    <div className={`p-4 border-l-4 ${bgColor} ${borderColor} mb-6 rounded-md`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${textColor}`} />
        </div>
        <div className="ml-3">
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-opacity-50 focus:outline-none`}
            >
              <span className="sr-only">Dismiss</span>
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [plans, setPlans] = useState([]) 
  const [isLoading, setIsLoading] = useState(true) 
  const [isPaying, setIsPaying] = useState(false) 
  const [subscription, setSubscription] = useState(null);
  const [pageMessage, setPageMessage] = useState({ text: null, type: null });

  const navigate = useNavigate(); 
  const location = useLocation(); 

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Step 1: Fetch plans AND subscription status
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Fetch public plans
        const plansResponse = await axios.get("http://localhost:8080/api/plans");
        const activePlans = plansResponse.data.filter(p => !p.planKey.toUpperCase().includes("PROFESSIONAL"));
        setPlans(activePlans);

        // If user is logged in, fetch their subscription status
        if (user && user.token) {
          const statusResponse = await axios.get(
            "http://localhost:8080/api/subscriptions/my-status",
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          setSubscription(statusResponse.data);
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();

    // ✅ Check for redirect messages
    if (location.state?.message) {
      setPageMessage({
        text: location.state.message,
        type: location.state.type || 'info' // 'info' or 'error'
      });
      // Clear the state so it doesn't show on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state]); // Rerun if location state changes


  // ✅ Step 2: Handle Payment Click (LOGIC UPDATED)
  const handlePayment = async (plan) => {
    
    // ✅ CRITICAL FIX: Make the check case-insensitive
    if (plan.planKey.toUpperCase() === "FREE") {
      if (user && user.token) {
        // User is logged in, redirect to builder with a new session
        navigate("/builder?new=true"); 
      } else {
        // User is not logged in, redirect to auth
        navigate("/auth");
      }
      return; // Stop execution for the FREE plan
    }

    // --- Logic for PREMIUM plan starts here ---
    if (!user || !user.token) {
        // alert("Please log in to purchase a subscription.");
        navigate("/auth");
        return;
    }
    
    setIsPaying(true); 

    try {
      // ✅ Step 3: Create Order
      const { data: response } = await axios.post(
        "http://localhost:8080/api/payments/create-order",
        {
          planId: plan.id,
          billingCycle: billingCycle,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // ✅ NO MORE JSON.parse! 'response' is already an object.

      // ✅ Step 4: Configure Razorpay Options
      const options = {
        key: response.razorpay_key_id,
        amount: response.amount, // Amount in paisa
        currency: "INR",
        name: "MyResuMate",
        description: `MyResuMate ${plan.name} - ${billingCycle} plan`,
        order_id: response.razorpay_order_id,
        
        // ✅ Step 5: Handle Payment Callback
        handler: async function (paymentResponse) {
          try {
            const verificationRequest = {
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              planId: plan.id,
              billingCycle: billingCycle
            };

            // ✅ Step 6: Verify Payment
            await axios.post(
              "http://localhost:8080/api/payments/verify-payment",
              verificationRequest,
              { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // ✅ SUCCESS REDIRECT: Set message in sessionStorage
            sessionStorage.setItem("paymentStatus", "success");
            
            // Update user in local storage to reflect premium status
            localStorage.setItem("user", JSON.stringify({...user, isPremium: true}));
            
            // Redirect to dashboard
            navigate("/dashboard");

          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            // ✅ FAILED REDIRECT
            setIsPaying(false); // Reset loading state
            navigate("/pricing", { state: { message: "Payment verification failed. Please contact support.", type: "error" } });
          }
        },
        prefill: {
          name: response.user_name,
          email: response.user_email,
        },
        theme: {
          color: "#8A2BE2",
        },
        modal: {
            ondismiss: function() {
                // ✅ *** THE FIX IS HERE ***
                setIsPaying(false); // Reset the loading button
                // ✅ CANCEL REDIRECT
                navigate("/pricing", { state: { message: "Payment was cancelled.", type: "info" } });
            }
        }
      };

      // ✅ Step 7: Open Razorpay Modal
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment initiation failed:", error);
      const errorMsg = error.response?.data?.message || "Failed to start payment. Please try again.";
      // Set message in page state, no redirect
      setPageMessage({ text: errorMsg, type: "error" });
      setIsPaying(false); 
    }
  };

  // ... (hardcoded features, testimonials, faqs arrays remain unchanged) ...
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
      name: "Dev Panchal",
      role: "Software Engineer",
      company: "Google",
      content: "MyResuMate Premium helped me land my dream job at Google. The ATS optimization was incredible!",
      avatar: "/Dev image.jpg",
      rating: 5,
    },
    {
      name: "Vyom Chauhan",
      role: "Marketing Director",
      company: "Meta",
      content: "The premium templates are stunning and the analytics helped me understand what works.",
      avatar: "/vyom.jpg",
      rating: 5,
    },
    {
      name: "Juhil Mistry",
      role: "Career Coach",
      company: "CareerPro",
      content: "Professional plan is perfect for my coaching business. My clients love the results!",
      avatar: "/Juhil.JPG",
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

  // ✅ Show full-page loader while fetching plans
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
      </div>
    );
  }

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
            {/* ... (Hero content is correct) ... */}
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
            {/* ✅ NEW: Page Message Display */}
            <PageMessage 
              message={pageMessage.text} 
              type={pageMessage.type}
              onClose={() => setPageMessage({ text: null, type: null })} 
            />

            {/* ✅ UPDATED Pricing Cards */}
            <div className="grid grid-cols-1 gap-8 mb-16 lg:grid-cols-2">
              {plans.map((plan) => {
                const isPremium = plan.planKey.toUpperCase().includes("PREMIUM");
                const gradient = isPremium ? "from-purple-600 to-pink-600" : "from-gray-500 to-gray-600";
                const bgGradient = isPremium ? "from-purple-50 to-pink-50" : "from-gray-50 to-gray-100";
                
                // ✅ NEW: Check if this is the user's active plan
                const isCurrentPlan = subscription?.planName === plan.name && subscription?.subscriptionStatus === "ACTIVE";
                
                let formattedRenewDate = '';
                if (isCurrentPlan) {
                  const date = new Date(subscription.endDate);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
                  const year = date.getFullYear();
                  formattedRenewDate = `${day}/${month}/${year}`;
                }

                // ✅ NEW: Check if user is premium
                const userIsPremium = subscription?.subscriptionStatus === "ACTIVE";

                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                      isPremium && !isCurrentPlan ? "ring-4 ring-purple-500 ring-opacity-50" : ""
                    } ${ isCurrentPlan ? "ring-4 ring-green-500" : "" }`}
                  >
                    {isPremium && !isCurrentPlan && (
                      <div className="absolute top-0 left-0 right-0 py-2 text-sm font-bold text-center text-white bg-gradient-to-r from-purple-600 to-pink-600">
                        <Star className="inline w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    )}
                    {isCurrentPlan && (
                      <div className="absolute top-0 left-0 right-0 py-2 text-sm font-bold text-center text-white bg-gradient-to-r from-green-500 to-emerald-500">
                        <Check className="inline w-4 h-4 mr-1" />
                        Your Current Plan
                      </div>
                    )}

                    <div className={`bg-gradient-to-br ${bgGradient} p-8 ${isPremium || isCurrentPlan ? "pt-12" : ""}`}>
                      <div className="mb-6 text-center">
                        <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="mb-4 text-gray-600">{plan.description}</p>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-gray-900">
                            ₹{billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                          </span>
                          <span className="ml-1 text-gray-600">/{billingCycle === "monthly" ? "month" : "year"}</span>
                        </div>
                      </div>

                      {/* ✅ NEW: Conditional Button Logic */}
                      {isCurrentPlan ? (
                        <div className="p-4 text-center bg-green-100 rounded-xl">
                          <p className="font-semibold text-green-800">Your plan is active!</p>
                          <p className="text-sm text-green-700">
                            Renews on: {formattedRenewDate}
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePayment(plan)}
                          // ✅ *** THE FIX IS HERE ***
                          // 1. Disable premium button if paying
                          // 2. Disable free button if user is already premium
                          disabled={(isPaying && isPremium) || (!isPremium && userIsPremium)} 
                          className={`w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 mb-2 bg-gradient-to-r ${gradient} hover:opacity-90 text-white disabled:opacity-50`}
                        >
                          {isPaying && isPremium ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              {isPremium ? <Crown className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                              {isPremium ? "Buy Premium" : "Get Started Free"}
                            </>
                          )}
                        </button>
                      )}
                      
                      <div className="mt-4 space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-3">
                            <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ... (rest of the page: Feature Comparison, Stats, Testimonials, FAQ) ... */}
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
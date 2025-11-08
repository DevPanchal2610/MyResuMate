"use client"

import { useState } from "react"
// ✅ Import useNavigate
import { Link, useNavigate } from "react-router-dom" 
import { Eye, Star, Crown, Zap } from "lucide-react"

const TemplateCard = ({ template }) => {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate();

  // ✅ Get user from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const isPremiumUser = user?.user?.isPremium || false;
  
  // ✅ Check if template is premium and if user has access
  const isPremiumTemplate = template.isPremium;
  const isLocked = isPremiumTemplate && !isPremiumUser;

  // ✅ Determine where the link goes
  const linkDestination = isLocked ? "/pricing" : `/builder?template=${template.id}`;

  // ✅ Handle click on a locked template
  const handleLockedClick = (e) => {
    if (isLocked) {
      e.preventDefault(); // Stop the link
      // alert("This is a Premium template. Please upgrade to use it.");
      navigate("/pricing");
    }
    // If not locked, the <Link> component will just navigate as normal
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Template Preview */}
      <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          // ✅ Use imageUrl from your API data
          src={template.imageUrl || `https://via.placeholder.com/400x565.png?text=${template.name}`}
          alt={template.name}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300">
            <div className="flex gap-3">
              {/* ✅ Change button to a Link for the details page */}
              <Link 
                to={`/templates/${template.id}`}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 transform hover:scale-110"
              >
                <Eye className="w-5 h-5" />
              </Link>
              <Link
              // ✅ Updated link logic
                to={linkDestination}
              onClick={handleLockedClick}
                className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110"
              >
              {/* ✅ Updated icon logic */}
                {isLocked ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </Link>
            </div>
          </div>
        )}

        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Crown className="w-3 h-3" />
            PREMIUM
          </div>
        )}

        {/* Free Badge */}
        {!template.isPremium && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            FREE
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            {/* ✅ Added a fallback for rating */}
            <span className="text-sm font-medium text-gray-600">{template.rating || '4.5'}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
            {template.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{template.tags.length - 2}
              </span>
            )}
          </div>
        
        {/* ✅ Removed downloads, as it wasn't in your API response */}
        </div>

        {/* Action Button */}
        <Link
          // ✅ Updated link logic
          to={linkDestination}
          onClick={handleLockedClick}
          className={`w-full mt-4 py-3 px-4 rounded-xl font-semibold text-center transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
            isLocked // ✅ Use isLocked for styling
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              : "btn-primary"
          }`}
        >
          {/* ✅ Updated text and icon */}
          {isLocked ? <Crown className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          {isLocked ? "Upgrade to Use" : "Use Template"}
        </Link>
      </div>
    </div>
  )
}

export default TemplateCard
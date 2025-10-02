"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, Star, Crown, Zap } from "lucide-react"

const TemplateCard = ({ template }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Template Preview */}
      <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={template.preview || "/placeholder.svg?height=320&width=240&query=professional resume template"}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300">
            <div className="flex gap-3">
              <button className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 transform hover:scale-110">
                <Eye className="w-5 h-5" />
              </button>
              <Link
                to={`/builder?template=${template.id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110"
              >
                <Zap className="w-5 h-5" />
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
            <span className="text-sm font-medium text-gray-600">{template.rating}</span>
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

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{template.downloads}+ downloads</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/builder?template=${template.id}`}
          className={`w-full mt-4 py-3 px-4 rounded-xl font-semibold text-center transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
            template.isPremium
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              : "btn-primary"
          }`}
        >
          {template.isPremium ? <Crown className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          Use Template
        </Link>
      </div>
    </div>
  )
}

export default TemplateCard

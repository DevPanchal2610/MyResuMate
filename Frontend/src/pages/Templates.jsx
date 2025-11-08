"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Filter, Grid, List, Star, Crown, Zap, Loader2 } from "lucide-react"
import Sidebar from "../components/Sidebar.jsx"
import TemplateCard from "../components/TemplateCard.jsx"
import ParallaxSection from "../components/ParallaxSection.jsx"

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: "all", name: "All Templates", count: 50 },
    { id: "tech", name: "Technology", count: 15 },
    { id: "business", name: "Business", count: 12 },
    { id: "creative", name: "Creative", count: 10 },
    { id: "healthcare", name: "Healthcare", count: 8 },
    { id: "education", name: "Education", count: 5 },
  ]

// ✅ Fetch templates from backend on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/templates");
        // Map backend 'templateKey' to frontend 'id' for the TemplateCard
        // And map 'tags' from comma-separated string to an array
        const formattedTemplates = response.data.map(template => ({
          ...template,
          id: template.templateKey, // Use templateKey for the link
          name: template.templateName,
          tags: template.tags ? template.tags.split(',') : [],
          imageUrl: template.previewImageUrl  
        }));
        setTemplates(formattedTemplates);
      } catch (error) {
        console.error("Error fetching templates:", error);
        // You could set an error state here
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []); // Empty dependency array means this runs once on mount

 const filteredTemplates = templates.filter((template) => {
    // ❗️ UPDATE THIS BLOCK
    const matchesSearch =
      (template.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => (tag || "").toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesType =
      selectedType === "all" ||
      (selectedType === "free" && !template.isPremium) ||
      (selectedType === "premium" && template.isPremium)

    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex">
        <div className="sticky w-64 h-screen overflow-y-auto bg-white shadow-lg top-16">
        {/* Sidebar */}
        <Sidebar className="sticky min-h-screen top-16"/>
  
        </div>

        {/* Main Content */}
        <div className="flex-1" >
          {/* Hero Section */}
          <ParallaxSection
            speed={0.5}
            className="py-16 text-white bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600"
          >
            <div className="max-w-6xl px-8 mx-auto text-center">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">Professional Resume Templates</h1>
              <p className="max-w-3xl mx-auto mb-8 text-xl">
                Choose from 50+ professionally designed templates. All templates are ATS-optimized and ready to use.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span>4.8/5 Average Rating</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Crown className="w-5 h-5 text-yellow-300" />
                  <span>Premium & Free Options</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span>ATS-Optimized</span>
                </div>
              </div>
            </div>
          </ParallaxSection>

          <div className="px-8 py-12 mx-auto max-w-7xl">
            {/* Filters */}
            <div className="p-6 mb-8 bg-white shadow-lg rounded-2xl">
              <div className="flex flex-col items-center gap-6 lg:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="free">Free Only</option>
                    <option value="premium">Premium Only</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredTemplates.length} of {templates.length} templates
              </p>
            </div>
            
            {/* ✅ ADD LOADING SPINNER */}
            {isLoading ? (
              
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              </div>

            ) : (
              
              <> {/* If not loading, show either templates or no results */}

                {/* Templates Grid */}
                <div
                  className={`grid gap-8 ${
                    viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                  }`}
                >
                  {filteredTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>

                {/* No Results (Only shows if not loading AND no templates) */}
                {filteredTemplates.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">No templates found</h3>
                    <p className="mb-6 text-gray-600">Try adjusting your search criteria or browse all templates.</p>
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("all")
                        setSelectedType("all")
                      }}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Templates

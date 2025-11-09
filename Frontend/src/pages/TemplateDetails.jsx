"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "../components/Sidebar.jsx"
import { Loader2, Crown, Zap, Star } from "lucide-react"

const TemplateDetails = () => {
  const { templateId } = useParams(); // Gets the 'id' from the URL
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isPremiumUser = user?.isPremium || false;

  useEffect(() => {
    const fetchTemplate = async () => {
      setIsLoading(true);
      try {
        // Fetch all templates...
        const response = await axios.get("http://localhost:8080/api/templates");
        // ...and find the one that matches the ID from the URL
        const foundTemplate = response.data.find(t => t.templateKey === templateId);

        if (foundTemplate) {
          // ✅ Prepend the backend server address to the image path
          const fullImageUrl = foundTemplate.previewImageUrl 
                               ? `http://localhost:8080${foundTemplate.previewImageUrl}` 
                               : null;

          // Format it just like on the main page
          setTemplate({
            ...foundTemplate,
            id: foundTemplate.templateKey,
            name: foundTemplate.templateName,
            tags: foundTemplate.tags ? foundTemplate.tags.split(',') : [],
            imageUrl: fullImageUrl // ✅ Set the full URL
          });
        } else {
          // Handle template not found
          console.error("Template not found");
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Template not found.
      </div>
    );
  }

  // Logic for the action button
  const isLocked = template.isPremium && !isPremiumUser;
  const linkDestination = isLocked ? "/pricing" : `/builder?template=${template.id}`;

  const handleUseTemplateClick = (e) => {
    if (isLocked) {
      e.preventDefault();
    //   alert("This is a Premium template. Please upgrade to use it.");
      navigate("/pricing");
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex">
        <div className="sticky w-64 h-screen overflow-y-auto bg-white shadow-lg top-16">
          <Sidebar className="sticky min-h-screen top-16" />
        </div>
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Left Column: Image */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={template.imageUrl || `https://via.placeholder.com/400x565.png?text=${template.name}`}
                  alt={template.name}
                  className="w-full h-full object-cover object-top"
                />  
              </div>

              {/* Right Column: Details */}
              <div className="flex flex-col">
                {/* Badge */}
                {template.isPremium ? (
                  <span className="flex items-center gap-1.5 w-fit px-3 py-1 mb-2 text-xs font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                    <Crown className="w-3 h-3" />
                    PREMIUM
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 w-fit px-3 py-1 mb-2 text-xs font-bold text-white bg-green-500 rounded-full">
                    FREE
                  </span>
                )}
                
                {/* Title */}
                <h1 className="mb-4 text-4xl font-bold gradient-text">{template.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-medium text-gray-700">{template.rating || '4.5'}</span>
                  <span className="text-gray-500">({template.downloads || '10k'}+ Users)</span>
                </div>
                
                {/* Description */}
                <p className="mb-6 text-lg text-gray-600">{template.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {template.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <Link
                  to={linkDestination}
                  onClick={handleUseTemplateClick}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-center text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
                    isLocked
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                      : "btn-primary"
                  }`}
                >
                  {isLocked ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  {isLocked ? "Upgrade to Use Template" : "Use This Template"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetails;
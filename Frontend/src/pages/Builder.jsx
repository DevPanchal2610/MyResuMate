"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Briefcase as Certificate,
  Plus,
  Trash2,
  Save,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react"
import Sidebar from "../components/Sidebar.jsx"
import ResumePreview from "../components/ResumePreview.jsx"

// Step Components (define outside Builder)
const PersonalInfo = ({ resumeData, updateResumeData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          value={resumeData.personal.firstName}
          onChange={(e) => updateResumeData("personal", { ...resumeData.personal, firstName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="John"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          value={resumeData.personal.lastName}
          onChange={(e) => updateResumeData("personal", { ...resumeData.personal, lastName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Doe"
        />
      </div>
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">Professional Title</label>
      <input
        type="text"
        value={resumeData.personal.title}
        onChange={(e) => updateResumeData("personal", { ...resumeData.personal, title: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Software Engineer"
      />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={resumeData.personal.email}
            onChange={(e) => updateResumeData("personal", { ...resumeData.personal, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={resumeData.personal.phone}
            onChange={(e) => updateResumeData("personal", { ...resumeData.personal, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={resumeData.personal.location}
          onChange={(e) => updateResumeData("personal", { ...resumeData.personal, location: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            value={resumeData.personal.website}
            onChange={(e) => updateResumeData("personal", { ...resumeData.personal, website: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://johndoe.com"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">LinkedIn</label>
          <input
            type="text"
            value={resumeData.personal.linkedin}
            onChange={(e) => updateResumeData("personal", { ...resumeData.personal, linkedin: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">GitHub</label>
          <input
            type="text"
            value={resumeData.personal.github}
            onChange={(e) => updateResumeData("personal", { ...resumeData.personal, github: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="github.com/johndoe"
        />
      </div>
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">Professional Summary</label>
      <textarea
        value={resumeData.personal.summary}
        onChange={(e) => updateResumeData("personal", { ...resumeData.personal, summary: e.target.value })}
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Write a brief summary of your professional background and key achievements..."
      />
    </div>
  </div>
);

const Experience = ({ resumeData, updateArrayItem, removeArrayItem, addArrayItem }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
      <button
        onClick={() =>
          addArrayItem("experience", {
            position: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
          })
        }
        className="flex items-center gap-2 btn-primary"
      >
        <Plus className="w-4 h-4" />
        Add Experience
      </button>
    </div>

    {resumeData.experience.map((exp, index) => (
      <div key={index} className="p-6 space-y-4 bg-gray-50 rounded-xl">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
          <button
            onClick={() => removeArrayItem("experience", index)}
            className="p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              value={exp.position}
              onChange={(e) => updateArrayItem("experience", index, { ...exp, position: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={exp.company}
              onChange={(e) => updateArrayItem("experience", index, { ...exp, company: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Tech Company Inc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="text"
              value={exp.startDate}
              onChange={(e) => updateArrayItem("experience", index, { ...exp, startDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Jan 2022"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
            <input
              type="text"
              value={exp.endDate}
              onChange={(e) => updateArrayItem("experience", index, { ...exp, endDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Present"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={exp.description}
            onChange={(e) => updateArrayItem("experience", index, { ...exp, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe your responsibilities and achievements..."
          />
        </div>
      </div>
    ))}

    {resumeData.experience.length === 0 && (
      <div className="py-12 text-center text-gray-500">
        <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No work experience added yet. Click "Add Experience" to get started.</p>
      </div>
    )}
  </div>
);

const Education = ({ resumeData, updateArrayItem, removeArrayItem, addArrayItem }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Education</h3>
      <button
        onClick={() =>
          addArrayItem("education", {
            degree: "",
            school: "",
            year: "",
            gpa: "",
          })
        }
        className="flex items-center gap-2 btn-primary"
      >
        <Plus className="w-4 h-4" />
        Add Education
      </button>
    </div>

    {resumeData.education.map((edu, index) => (
      <div key={index} className="p-6 space-y-4 bg-gray-50 rounded-xl">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
          <button onClick={() => removeArrayItem("education", index)} className="p-1 text-red-500 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Degree</label>
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => updateArrayItem("education", index, { ...edu, degree: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Bachelor of Science in Computer Science"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">School</label>
            <input
              type="text"
              value={edu.school}
              onChange={(e) => updateArrayItem("education", index, { ...edu, school: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="University of California, Berkeley"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Graduation Year</label>
            <input
              type="text"
              value={edu.year}
              onChange={(e) => updateArrayItem("education", index, { ...edu, year: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="2022"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">GPA (Optional)</label>
            <input
              type="text"
              value={edu.gpa}
              onChange={(e) => updateArrayItem("education", index, { ...edu, gpa: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="3.8"
            />
          </div>
        </div>
      </div>
    ))}

    {resumeData.education.length === 0 && (
      <div className="py-12 text-center text-gray-500">
        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No education added yet. Click "Add Education" to get started.</p>
      </div>
    )}
  </div>
);

const Projects = ({ resumeData, updateArrayItem, removeArrayItem, addArrayItem }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
      <button
        onClick={() =>
          addArrayItem("projects", {
            name: "",
            description: "",
            technologies: "",
            url: "",
          })
        }
        className="flex items-center gap-2 btn-primary"
      >
        <Plus className="w-4 h-4" />
        Add Project
      </button>
    </div>

    {resumeData.projects.map((project, index) => (
      <div key={index} className="p-6 space-y-4 bg-gray-50 rounded-xl">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
          <button onClick={() => removeArrayItem("projects", index)} className="p-1 text-red-500 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateArrayItem("projects", index, { ...project, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="E-commerce Platform"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Project URL (Optional)</label>
            <input
              type="url"
              value={project.url}
              onChange={(e) => updateArrayItem("projects", index, { ...project, url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://github.com/username/project"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={project.description}
            onChange={(e) => updateArrayItem("projects", index, { ...project, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe what the project does and your role in it..."
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
          <input
            type="text"
            value={project.technologies}
            onChange={(e) => updateArrayItem("projects", index, { ...project, technologies: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="React, Node.js, MongoDB, AWS"
          />
        </div>
      </div>
    ))}

    {resumeData.projects.length === 0 && (
      <div className="py-12 text-center text-gray-500">
        <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No projects added yet. Click "Add Project" to get started.</p>
      </div>
    )}
  </div>
);

const Skills = ({ resumeData, updateArrayItem, removeArrayItem, addArrayItem }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
      <button
        onClick={() =>
          addArrayItem("skills", {
            category: "",
            items: "",
          })
        }
        className="flex items-center gap-2 btn-primary"
      >
        <Plus className="w-4 h-4" />
        Add Skill Category
      </button>
    </div>

    {resumeData.skills.map((skillGroup, index) => (
      <div key={index} className="p-6 space-y-4 bg-gray-50 rounded-xl">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900">Skill Category {index + 1}</h4>
          <button onClick={() => removeArrayItem("skills", index)} className="p-1 text-red-500 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            value={skillGroup.category}
            onChange={(e) => updateArrayItem("skills", index, { ...skillGroup, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Programming Languages"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Skills (comma-separated)</label>
          <input
            type="text"
            value={skillGroup.items}
            onChange={(e) => updateArrayItem("skills", index, { ...skillGroup, items: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="JavaScript, Python, Java, C++"
          />
        </div>
      </div>
    ))}

    {resumeData.skills.length === 0 && (
      <div className="py-12 text-center text-gray-500">
        <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No skills added yet. Click "Add Skill Category" to get started.</p>
      </div>
    )}
  </div>
);

const Certifications = ({ resumeData, updateArrayItem, removeArrayItem, addArrayItem }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
      <button
        onClick={() =>
          addArrayItem("certifications", {
            name: "",
            issuer: "",
            date: "",
          })
        }
        className="flex items-center gap-2 btn-primary"
      >
        <Plus className="w-4 h-4" />
        Add Certification
      </button>
    </div>

    {resumeData.certifications.map((cert, index) => (
      <div key={index} className="p-6 space-y-4 bg-gray-50 rounded-xl">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900">Certification {index + 1}</h4>
          <button
            onClick={() => removeArrayItem("certifications", index)}
            className="p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Certification Name</label>
            <input
              type="text"
              value={cert.name}
              onChange={(e) => updateArrayItem("certifications", index, { ...cert, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="AWS Certified Solutions Architect"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Issuing Organization</label>
            <input
              type="text"
              value={cert.issuer}
              onChange={(e) => updateArrayItem("certifications", index, { ...cert, issuer: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Amazon Web Services"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Date Obtained</label>
          <input
            type="text"
            value={cert.date}
            onChange={(e) => updateArrayItem("certifications", index, { ...cert, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="March 2023"
          />
        </div>
      </div>
    ))}

    {resumeData.certifications.length === 0 && (
      <div className="py-12 text-center text-gray-500">
        <Certificate className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No certifications added yet. Click "Add Certification" to get started.</p>
      </div>
    )}
  </div>
);

const initialResumeState = {
  resumeId: null,
  resumeTitle: "My New Resume",
  templateKey: "modern", // Default template
  personal: {
    firstName: "", lastName: "", title: "", email: "", phone: "",
    location: "", website: "", linkedin: "", github: "", summary: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
};

const Builder = () => {
  const [searchParams] = useSearchParams() // <-- Get URL search params
  const navigate = useNavigate();

 const selectedTemplateKey = searchParams.get("template"); // For NEW resumes
  const resumeIdToLoad = searchParams.get("resumeId"); // For EXISTING resumes

  const [currentStep, setCurrentStep] = useState(0)
  const [showPreview, setShowPreview] = useState(true)

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Page load spinner
  const [saveStatus, setSaveStatus] = useState(""); // "Saving...", "Saved!", "Error!"
  // ✅ STATE INITIALIZATION:
  // 1. Try to load a draft from session storage.
  // 2. If no draft, start with the empty state.
  const [resumeData, setResumeData] = useState(() => {
    const savedDraft = sessionStorage.getItem("draftResume");
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error("Could not parse draft, starting fresh.");
      }
    }
    return initialResumeState;
  });

  // ✅ MAIN DATA LOADING/HANDLING EFFECT
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.token) {
        navigate("/auth"); // Not logged in, redirect
        return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        if (resumeIdToLoad) {
          // --- 1. LOAD EXISTING RESUME (from dashboard) ---
          const response = await axios.get(
            `http://localhost:8080/api/resumes/${resumeIdToLoad}`,
            { headers: { Authorization: `Bearer ${storedUser.token}` } }
          );
          setResumeData(response.data); // Load data from API
          sessionStorage.setItem("draftResume", JSON.stringify(response.data)); // Set as new draft

        } else if (selectedTemplateKey) {
          // --- 2. CREATE NEW RESUME (from template page) ---
          // Clear any old draft and start fresh with the new template
          const newDraft = { ...initialResumeState, templateKey: selectedTemplateKey };
          setResumeData(newDraft);
          sessionStorage.setItem("draftResume", JSON.stringify(newDraft));
        }
        // --- 3. (Else) Just keep the draft loaded from useState ---
      } catch (err) {
        console.error("Failed to load resume", err);
        navigate("/dashboard"); // On error, go back to dashboard
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [resumeIdToLoad, selectedTemplateKey, navigate]); // This effect re-runs if the URL params change

  
  // ✅ AUTO-SAVE DRAFT: Save to session storage on any change
  useEffect(() => {
    // Only save to session if we are NOT in the initial page load
    if (!isLoading) {
      sessionStorage.setItem("draftResume", JSON.stringify(resumeData));
    }
  }, [resumeData, isLoading]); // Dependency on resumeData triggers this

  const steps = [
    { id: 0, name: "Personal", icon: <User className="w-5 h-5" />, component: "PersonalInfo" },
    { id: 1, name: "Education", icon: <GraduationCap className="w-5 h-5" />, component: "Education" },
    { id: 2, name: "Experience", icon: <Briefcase className="w-5 h-5" />, component: "Experience" },
    { id: 3, name: "Projects", icon: <Code className="w-5 h-5" />, component: "Projects" },
    { id: 4, name: "Skills", icon: <Award className="w-5 h-5" />, component: "Skills" },
    { id: 5, name: "Certifications", icon: <Certificate className="w-5 h-5" />, component: "Certifications" },
  ]

  const updateResumeData = (section, data) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const addArrayItem = (section, item) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], item],
    }))
  }

  const updateArrayItem = (section, index, item) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].map((existing, i) => (i === index ? item : existing)),
    }))
  }

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo resumeData={resumeData} updateResumeData={updateResumeData} />
      case 1:
        return <Education resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} />
      case 2:
        return <Experience resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} />
      case 3:
        return <Projects resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} />
      case 4:
        return <Skills resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} />
      case 5:
        return <Certifications resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} />
      default:
        return <PersonalInfo resumeData={resumeData} updateResumeData={updateResumeData} />
    }
  }

// ✅ UPDATED SAVE FUNCTION
  const handleSaveResume = async () => {
    setIsSaving(true);
    setSaveStatus("Saving...");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.token) {
      setIsSaving(false);
      setSaveStatus("Error: You must be logged in.");
      navigate("/auth");
      return;
    }

    // ✅ PAYLOAD FIX: The payload is just the resumeData state
    // It now correctly includes the 'resumeId' if it exists
    // and the 'templateKey'
    const payload = {
      ...resumeData,
      templateKey: resumeData.templateKey || selectedTemplateKey || "modern"
    };
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/resumes/save",
        payload,
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );

      // ✅ DUPLICATION FIX:
      // Update state with the ID from the backend (for both new and updated resumes)
      const savedResume = { ...resumeData, resumeId: response.data.id };
      setResumeData(savedResume);
      sessionStorage.setItem("draftResume", JSON.stringify(savedResume)); // Update the draft
      setSaveStatus("Saved!");
      
    } catch (err) {
      console.error("Error saving resume:", err);
      setSaveStatus(err.response?.data || "Error! Please try again.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // ✅ LOADING SPINNER: Show a spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
      </div>
    );
  }

  // ✅ Get the template key from the loaded data
  const currentTemplateKey = resumeData.templateKey || "modern";

 return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex">
        <div className="sticky w-64 h-screen overflow-y-auto bg-white shadow-lg top-16">
          {/* Sidebar */}
          <Sidebar className="sticky min-h-screen top-16" />
        </div>

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Form Section */}
          <div className={`${showPreview ? "w-1/2" : "w-full"} overflow-x-auto transition-all duration-300`}>
            <div className="p-8 min-w-[600px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="mb-2 text-3xl font-bold gradient-text">Resume Builder</h1>
                  {/* ✅ UPDATED: Title input now uses resumeData state */}
                  <input 
                    type="text"
                    value={resumeData.resumeTitle}
                    onChange={(e) => setResumeData(prev => ({ ...prev, resumeTitle: e.target.value }))}
                    className="text-lg text-gray-600 font-medium p-1 -ml-1 rounded-lg border border-transparent hover:border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 btn-secondary"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? "Hide" : "Show"} Preview
                  </button>
                  <button 
                    onClick={handleSaveResume}
                    disabled={isSaving}
                    className="flex items-center gap-2 btn-primary disabled:opacity-75"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saveStatus || "Save"}
                  </button>
                  <button className="flex items-center gap-2 btn-primary">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => setCurrentStep(index)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                          index === currentStep
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                            : index < currentStep
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                        }`}
                      >
                        {index < currentStep ? <Check className="w-5 h-5" /> : step.icon}
                      </button>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-1 mx-2 ${
                            index < currentStep ? "bg-green-500" : "bg-gray-200"
                          } transition-colors duration-200`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  {steps.map((step) => (
                    <span key={step.id} className="text-center">
                      {step.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-8 mb-8 bg-white shadow-lg rounded-2xl">{renderStepContent()}</div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentStep === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentStep === steps.length - 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "btn-primary"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="w-1/2 overflow-auto bg-gray-100">
              <div className="p-8">
                <div className="mb-4">
                  <h2 className="mb-2 text-xl font-bold text-gray-900">Live Preview</h2>
                  <p className="text-sm text-gray-600">See how your resume looks in real-time</p>
                </div>
                <div className="sticky top-0">
                  {/* === THIS IS THE UPDATED LINE === */}
                  <ResumePreview resumeData={resumeData} template={currentTemplateKey} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Builder;
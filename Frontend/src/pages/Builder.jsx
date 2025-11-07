"use client"

import { useState, useEffect,useRef } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
// import jsPDF from "jspdf"
// import { PDFDownloadLink } from "@react-pdf/renderer"
import { useReactToPrint } from "react-to-print"
// import html2canvas from "html2canvas"
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
// import ResumeDocument from "../components/ResumeDocument.jsx"

// ====================================================================
// ✅ HELPER: ERROR MESSAGE COMPONENT
// ====================================================================
const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return <span className="text-red-500 text-xs mt-1">{error}</span>;
};

// Step Components (define outside Builder)
const PersonalInfo = ({ resumeData, updateResumeData, errors, validateStep }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          value={resumeData.personal.firstName}
          onBlur={validateStep} // Validate on blur
          onChange={(e) => updateResumeData("personal", { ...resumeData.personal, firstName: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.personal?.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
          placeholder="John"
          maxLength={50}
        />
        <ErrorMessage error={errors.personal?.firstName} />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          value={resumeData.personal.lastName}
          onBlur={validateStep}
          onChange={(e) => updateResumeData("personal", { ...resumeData.personal, lastName: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.personal?.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
          placeholder="Doe"
          maxLength={50}
        />
        <ErrorMessage error={errors.personal?.lastName} />
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
        maxLength={100}
      />
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={resumeData.personal.email}
          onBlur={validateStep}
          onChange={(e) => updateResumeData("personal", { ...resumeData.personal, email: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.personal?.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
          placeholder="john@example.com"
          maxLength={100}
        />
        <ErrorMessage error={errors.personal?.email} />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={resumeData.personal.phone}
          onBlur={validateStep}
          onChange={(e) => updateResumeData("personal", { ...resumeData.personal, phone: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.personal?.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
          placeholder="+91 98765 43210"
          maxLength={15}
        />
        <ErrorMessage error={errors.personal?.phone} />
      </div>
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">Location</label>
      <input
        type="text"
        value={resumeData.personal.location}
        onChange={(e) => updateResumeData("personal", { ...resumeData.personal, location: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Ahmedabad, Gujarat"
        maxLength={100}
      />
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Website</label>
        <input
          type="url"
          value={resumeData.personal.website}
          onBlur={validateStep}
          onChange={(e) => updateResumeData("personal", { ...resumeData.personal, website: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.personal?.website ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
          placeholder="https://johndoe.com"
          maxLength={100}
        />
        <ErrorMessage error={errors.personal?.website} />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">LinkedIn</label>
        <input
          type="text"
          value={resumeData.personal.linkedin}
          onChange={(e) => updateResumeData("personal", { ...resumeData.personal, linkedin: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="linkedin.com/in/johndoe"
          maxLength={100}
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
          maxLength={100}
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
        placeholder="Write a brief summary of your professional background..."
        maxLength={1000}
      />
    </div>
  </div>
);

const Experience = ({ resumeData, updateArrayItem, removeArrayItem, addArrayItem, errors, validateStep }) => (
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
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>

    {resumeData.experience.map((exp, index) => (
      <div key={index} className="p-6 space-y-4 bg-gray-50 rounded-xl">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
          <button onClick={() => removeArrayItem("experience", index)} className="p-1 text-red-500 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              value={exp.position}
                onBlur={validateStep}
              onChange={(e) => updateArrayItem("experience", index, { ...exp, position: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.experience[index]?.position ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
              placeholder="Software Engineer"
              maxLength={100}
            />
            <ErrorMessage error={errors.experience[index]?.position} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={exp.company}
                onBlur={validateStep}
              onChange={(e) => updateArrayItem("experience", index, { ...exp, company: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.experience[index]?.company ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
              placeholder="Tech Company Inc."
              maxLength={100}
            />
            <ErrorMessage error={errors.experience[index]?.company} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="text"
              value={exp.startDate}
                onBlur={validateStep}
              onChange={(e) => updateArrayItem("experience", index, { ...exp, startDate: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.experience[index]?.startDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
              placeholder="Jan 2022"
              maxLength={20}
            />
            <ErrorMessage error={errors.experience[index]?.startDate} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
            <input
              type="text"
              value={exp.endDate}
                onBlur={validateStep}
              onChange={(e) => updateArrayItem("experience", index, { ...exp, endDate: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.experience[index]?.endDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
              placeholder="Present"
              maxLength={20}
            />
            <ErrorMessage error={errors.experience[index]?.endDate} />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={exp.description}
            onChange={(e) => updateArrayItem("experience", index, { ...exp, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe responsibilities (e.g., 'Developed feature X, resulting in Y')"
            maxLength={1000}
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

const Education = ({ resumeData, updateArrayItem, removeArrayItem, addArrayItem, errors, validateStep }) => (
  <div className="space-y-6">
    {/* ✅ FIX: Added "Add" button and wrapper */}
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
                onBlur={validateStep}
              onChange={(e) => updateArrayItem("education", index, { ...edu, degree: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.education[index]?.degree ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
              placeholder="B.S. in Computer Science"
              maxLength={100}
            />
            <ErrorMessage error={errors.education[index]?.degree} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">School</label>
            <input
              type="text"
              value={edu.school}
                onBlur={validateStep}
              onChange={(e) => updateArrayItem("education", index, { ...edu, school: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.education[index]?.school ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
              placeholder="University of Example"
              maxLength={100}
            />
            <ErrorMessage error={errors.education[index]?.school} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Graduation Year</label>
            <input
              type="text"
              value={edu.year}
                onBlur={validateStep}
              onChange={(e) => updateArrayItem("education", index, { ...edu, year: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.education[index]?.year ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
              placeholder="2022"
              maxLength={20}
            />
            <ErrorMessage error={errors.education[index]?.year} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">GPA (Optional)</label>
            <input
              type="text"
              value={edu.gpa}
              onChange={(e) => updateArrayItem("education", index, { ...edu, gpa: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="3.8/4.0"
              maxLength={10}
            />
          </div>
        </div>
      </div>
    ))}
    {/* ✅ FIX: Added empty state */}
    {resumeData.education.length === 0 && (
      <div className="py-12 text-center text-gray-500">
        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No education added yet. Click "Add Education" to get started.</p>
      </div>
    )}
  </div>
);

const Projects = ({ resumeData, updateArrayItem, removeArrayItem, addArrayItem, errors, validateStep }) => (
  <div className="space-y-6">
    {/* ✅ FIX: Added "Add" button and wrapper */}
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
                onBlur={validateStep}
              onChange={(e) => updateArrayItem("projects", index, { ...project, name: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.projects[index]?.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
              placeholder="E-commerce Platform"
              maxLength={100}
            />
            <ErrorMessage error={errors.projects[index]?.name} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Project URL (Optional)</label>
            <input
              type="url"
              value={project.url}
              onChange={(e) => updateArrayItem("projects", index, { ...project, url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://github.com/username/project"
              maxLength={255}
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
            placeholder="Describe what the project does..."
            maxLength={1000}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
          <input
            type="text"
            value={project.technologies}
            onChange={(e) => updateArrayItem("projects", index, { ...project, technologies: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="React, Node.js, MongoDB"
            maxLength={255}
          />
        </div>
      </div>
    ))}
    {/* ✅ FIX: Added empty state */}
    {resumeData.projects.length === 0 && (
      <div className="py-12 text-center text-gray-500">
        <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No projects added yet. Click "Add Project" to get started.</p>
      </div>
    )}
  </div>
);

const Skills = ({ resumeData, updateArrayItem, removeArrayItem, addArrayItem, errors, validateStep }) => (
  <div className="space-y-6">
    {/* ✅ FIX: Added "Add" button and wrapper */}
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
              onBlur={validateStep}
            onChange={(e) => updateArrayItem("skills", index, { ...skillGroup, category: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.skills[index]?.category ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
            placeholder="Programming Languages"
            maxLength={50}
          />
          <ErrorMessage error={errors.skills[index]?.category} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Skills (comma-separated)</label>
          <input
            type="text"
            value={skillGroup.items}
              onBlur={validateStep}
            onChange={(e) => updateArrayItem("skills", index, { ...skillGroup, items: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${errors.skills[index]?.items ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
            placeholder="JavaScript, Python, Java, C++"
            maxLength={500}
          />
          <ErrorMessage error={errors.skills[index]?.items} />
        </div>
      </div>
    ))}
    {/* ✅ FIX: Added empty state */}
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
    {/* ✅ FIX: Added "Add" button and wrapper */}
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
              maxLength={100}
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
              maxLength={100}
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
            maxLength={20}
          />
        </div>
      </div>
    ))}
    {/* ✅ FIX: Added empty state */}
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

// ✅ HELPER: Define the initial error state
const initialErrorState = {
  personal: {},
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

  const isNew = searchParams.get("new");

  const [currentStep, setCurrentStep] = useState(0)
  const [showPreview, setShowPreview] = useState(true)

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Page load spinner
  const [saveStatus, setSaveStatus] = useState(""); // "Saving...", "Saved!", "Error!"

  // const [isDownloading, setIsDownloading] = useState(false);

  const [errors, setErrors] = useState(initialErrorState);

  const previewRef = useRef(null);

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
        }else if (isNew) {
          // --- 3. CREATE NEW RESUME (from "Create New" button) ---
          // Start with a blank slate and a default template
          const newDraft = { ...initialResumeState, templateKey: "modern" };
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
  }, [resumeIdToLoad, selectedTemplateKey, isNew, navigate]); // This effect re-runs if the URL params change

  
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

// ====================================================================
  // ✅ NEW: VALIDATION LOGIC
  // ====================================================================

  const validateData = (data, step = -1) => {
    const newErrors = {
      personal: {},
      education: data.education.map(() => ({})),
      experience: data.experience.map(() => ({})),
      projects: data.projects.map(() => ({})),
      skills: data.skills.map(() => ({})),
      certifications: [], // Certs are all optional
    };
    let isValid = true;

    // --- Validate Personal Info (Step 0) ---
    if (step === 0 || step === -1) {
      // ✅ Removed required checks for name
      if (data.personal.email && !/\S+@\S+\.\S+/.test(data.personal.email)) {
        newErrors.personal.email = 'Invalid email address.'; isValid = false;
      }
      
      if (data.personal.phone && !/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(data.personal.phone)) {
        newErrors.personal.phone = 'Must be a valid 10-digit Indian mobile number.'; isValid = false;
      }

      if (data.personal.website && data.personal.website.length > 0 && !/^https?:\/\/.+/.test(data.personal.website)) {
         newErrors.personal.website = 'Must be a valid URL (e.g., https://...)'; isValid = false;
      }
    }

    // --- Validate Education (Step 1) ---
    if (step === 1 || step === -1) {
      data.education.forEach((edu, index) => {
        // All fields are optional now
      });
    }
    
    // --- Validate Experience (Step 2) ---
    if (step === 2 || step === -1) {
      data.experience.forEach((exp, index) => {
        // All fields are optional now
      });
    }

    // --- Validate Projects (Step 3) ---
    if (step === 3 || step === -1) {
       data.projects.forEach((proj, index) => {
        // All fields are optional now
      });
    }

    // --- Validate Skills (Step 4) ---
    if (step === 4 || step === -1) {
       data.skills.forEach((skill, index) => {
        // All fields are optional now
      });
    }
    setErrors(newErrors);
    return isValid;
  };


  // ✅ RENDERSTEPCONTENT (Updated to pass errors and validation)
  const renderStepContent = () => {
    const stepToValidate = currentStep; // Capture current step for the onBlur callback
    const validateCurrentStep = () => validateData(resumeData, stepToValidate);

    switch (currentStep) {
      case 0:
        return <PersonalInfo resumeData={resumeData} updateResumeData={updateResumeData} errors={errors} validateStep={validateCurrentStep} />
      case 1:
        return <Education resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} errors={errors} validateStep={validateCurrentStep} />
      case 2:
        return <Experience resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} errors={errors} validateStep={validateCurrentStep} />
      case 3:
        return <Projects resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} errors={errors} validateStep={validateCurrentStep} />
      case 4:
        return <Skills resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} errors={errors} validateStep={validateCurrentStep} />
      case 5:
        return <Certifications resumeData={resumeData} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} addArrayItem={addArrayItem} errors={errors} validateStep={validateCurrentStep} />
      default:
        return <PersonalInfo resumeData={resumeData} updateResumeData={updateResumeData} errors={errors} validateStep={validateCurrentStep} />
    }
  }

// ✅ UPDATED SAVE FUNCTION (With validation)
  const handleSaveResume = async () => {
    // 1. Validate ALL steps
    if (!validateData(resumeData, -1)) { // -1 means validate all
      setSaveStatus("Please fix errors");
      setTimeout(() => setSaveStatus(""), 3000);
      return; // Stop saving
    }

    setIsSaving(true);
    setSaveStatus("Saving...");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.token) {
      setIsSaving(false);
      setSaveStatus("Error: You must be logged in.");
      navigate("/auth");
      return;
    }

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

      const savedResume = { ...payload, resumeId: response.data.id };
      setResumeData(savedResume);
      sessionStorage.setItem("draftResume", JSON.stringify(savedResume)); 
      setSaveStatus("Saved!");
      
    } catch (err) {
      console.error("Error saving resume:", err);
      setSaveStatus(err.response?.data || "Error! Please try again.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // ✅ NEW: Handle Next Button Click
  const handleNext = () => {
    // Validate just the current step
    if (validateData(resumeData, currentStep)) {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    }
  };

  // ✅ NEW: Handle Previous Button Click
  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  // ✅ UPDATED: DOWNLOAD PDF FUNCTION
  const handleDownload = useReactToPrint({
    contentRef: previewRef,
    documentTitle: resumeData.resumeTitle || "MyResuMate-Resume",
    onAfterPrint: () => console.log('Print success'),
    onPrintError: (error) => console.error('Print error:', error),
  });
  // ✅ LOADING SPINNER: Show a spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
      </div>
    );
  }

  // ✅ Get the template key from the loaded data
  const currentTemplateKey = resumeData.templateKey || selectedTemplateKey || "modern";

 return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="flex">
        <div className="sticky w-64 h-screen overflow-y-auto bg-white shadow-lg top-16">
          {/* Sidebar */}
          <Sidebar className="sticky min-h-screen top-16" />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-x-auto">
          {/* Form Section */}
          <div className={`${showPreview ? "flex-shrink-0" : "w-full"} transition-all duration-300`}>
            <div className="p-8 min-w-[600px]">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="mb-2 text-3xl font-bold gradient-text">Resume Builder</h1>
                  {/* ✅ UPDATED: Title input now uses resumeData state */}
                  <input 
                    type="text"
                    value={resumeData.resumeTitle}
                    onChange={(e) => setResumeData(prev => ({ ...prev, resumeTitle: e.target.value }))}
                    className="text-lg text-gray-600 font-medium p-1 -ml-1 rounded-lg border border-transparent hover:border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    maxLength={100}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4">
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
                  {/* ✅ UPDATED: Download button */}
                  <button 
                    onClick={handleDownload} 
                    className="flex items-center gap-2 btn-primary"
                  >
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
                  onClick={handlePrevious}
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
                  onClick={handleNext}
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

         {/* ========================================================== */}
          {/* ✅ CRITICAL FIX: PREVIEW SECTION
               We now have TWO resume previews.
               1. A VISIBLE one for the user.
               2. A HIDDEN one for the print library to "see".
           */}
          {/* ========================================================== */}

         {/* ========================================================== */}
          {/* ✅ UPDATED: PREVIEW SECTION */}
          {/* ========================================================== */}
          {showPreview && (
            <div className="flex-1 w-1/2 min-w-[400px] overflow-auto bg-gray-300 p-8">
              <div className="mb-4">
                <h2 className="mb-2 text-xl font-bold text-gray-900">Live Preview</h2>
                <p className="text-sm text-gray-600">See how your resume looks in real-time</p>
              </div>
              
              {/* ✅ REMOVED the fixed height wrapper - let it flow naturally */}
              <div className="bg-white">
                <ResumePreview 
                  ref={previewRef} 
                  resumeData={resumeData} 
                  template={currentTemplateKey} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Builder;
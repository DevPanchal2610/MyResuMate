"use client"

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react"

// Helper component for section titles to keep code DRY
const SectionTitle = ({ title }) => (
  <h2 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-purple-500 pl-3">{title}</h2>
)

const ResumePreview = ({ resumeData, template = "modern" }) => {
  const { personal = {}, education = [], experience = [], projects = [], skills = [], certifications = [] } = resumeData

  // A helper function to safely split comma-separated strings
  const splitAndTrim = (str) => (str ? str.split(",").map((item) => item.trim()) : [])

  switch (template) {
    // =================================================================
    // TEMPLATE 2: PROFESSIONAL (Two-Column Layout)
    // =================================================================
    case "professional":
      return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex font-sans">
          {/* Left Column (Dark) */}
          <div className="w-1/3 bg-gray-800 text-white p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-1">
                {personal.firstName || "Your"} {personal.lastName || "Name"}
              </h1>
              <p className="text-lg text-purple-300">{personal.title || "Professional Title"}</p>
            </div>

            <div className="space-y-6">
              {/* Contact */}
              <div>
                <h2 className="text-lg font-semibold text-purple-300 uppercase tracking-wider mb-3">Contact</h2>
                <div className="space-y-2 text-sm">
                  {personal.email && <div className="flex items-center gap-2 break-words"><Mail size={14} /><span>{personal.email}</span></div>}
                  {personal.phone && <div className="flex items-center gap-2 break-words"><Phone size={14} /><span>{personal.phone}</span></div>}
                  {personal.location && <div className="flex items-center gap-2"><MapPin size={14} /><span>{personal.location}</span></div>}
                  {personal.website && <div className="flex items-center gap-2"><Globe size={14} /><span>{personal.website}</span></div>}
                  {personal.linkedin && <div className="flex items-center gap-2"><Linkedin size={14} /><span>{personal.linkedin}</span></div>}
                  {personal.github && <div className="flex items-center gap-2"><Github size={14} /><span>{personal.github}</span></div>}
                </div>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-purple-300 uppercase tracking-wider mb-3">Skills</h2>
                  <div className="space-y-3">
                    {skills.map((skillGroup, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-white">{skillGroup.category || "Category"}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {splitAndTrim(skillGroup.items).map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-200 text-purple-900 text-xs rounded">{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-purple-300 uppercase tracking-wider mb-3">Education</h2>
                  <div className="space-y-3 text-sm">
                    {education.map((edu, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-white">{edu.degree || "Degree"}</h3>
                        <p className="text-gray-300">{edu.school || "School"}</p>
                        <p className="text-gray-400 text-xs">{edu.year || "Year"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Light) */}
          <div className="w-2/3 bg-white p-8 space-y-6">
            {personal.summary && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Summary</h2>
                <p className="text-gray-700 leading-relaxed text-sm">{personal.summary}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Experience</h2>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-900">{exp.position || "Position"}</h3>
                        <p className="text-sm text-gray-500">{exp.startDate || "Start"} - {exp.endDate || "End"}</p>
                      </div>
                      <p className="text-purple-600 font-medium">{exp.company || "Company"}</p>
                      <p className="mt-1 text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Projects</h2>
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900">{project.name || "Project Name"}</h3>
                      <p className="mt-1 text-gray-700 text-sm leading-relaxed">{project.description}</p>
                       {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {splitAndTrim(project.technologies).map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )

    // =================================================================
    // TEMPLATE 3: CHRONOLOGICAL (Classic, Highly ATS-Friendly)
    // =================================================================
    case "chronological":
      return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full p-8 font-serif">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {personal.firstName || "Your"} {personal.lastName || "Name"}
            </h1>
            <p className="text-xl text-gray-600 mt-1">{personal.title || "Professional Title"}</p>
            <div className="text-xs text-gray-500 mt-4 flex justify-center items-center flex-wrap gap-x-4 gap-y-1">
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>| {personal.phone}</span>}
              {personal.location && <span>| {personal.location}</span>}
              {personal.linkedin && <span>| {personal.linkedin}</span>}
              {personal.github && <span>| {personal.github}</span>}
            </div>
          </header>

          <div className="space-y-6">
            {personal.summary && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-3">Summary</h2>
                <p className="text-gray-800 leading-relaxed">{personal.summary}</p>
              </section>
            )}

            {experience.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-3">Experience</h2>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-semibold">{exp.position || "Position"}</h3>
                        <p className="text-sm text-gray-600">{exp.startDate || "Start"} - {exp.endDate || "End"}</p>
                      </div>
                      <p className="font-medium text-gray-700">{exp.company || "Company"}</p>
                      <ul className="list-disc list-inside mt-1 text-gray-800 text-sm space-y-1">
                        {splitAndTrim(exp.description).map((desc, i) => <li key={i}>{desc}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-3">Education</h2>
                <div className="space-y-2">
                  {education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-baseline">
                      <div>
                        <h3 className="text-lg font-semibold">{edu.degree || "Degree"}</h3>
                        <p className="font-medium text-gray-700">{edu.school || "School"}</p>
                      </div>
                       <p className="text-sm text-gray-600">{edu.year || "Year"}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {skills.length > 0 && (
               <section>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-3">Skills</h2>
                  <div className="space-y-1">
                     {skills.map((skillGroup, index) => (
                        <div key={index} className="flex items-baseline">
                           <p className="w-1/4 font-semibold text-sm">{skillGroup.category || "Category"}:</p>
                           <p className="w-3/4 text-sm">{skillGroup.items || "Your skills"}</p>
                        </div>
                     ))}
                  </div>
               </section>
            )}
          </div>
        </div>
      )
      
    // =================================================================
    // TEMPLATE 1: MODERN (Your original template, now in the switch)
    // =================================================================
    case "modern":
    default:
      return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center border-b border-gray-200 pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {personal.firstName || "Your"} {personal.lastName || "Name"}
              </h1>
              <p className="text-lg text-purple-600 font-medium mb-4">{personal.title || "Your Professional Title"}</p>

              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-600">
                {personal.email && <div className="flex items-center gap-1"><Mail size={14} /><span>{personal.email}</span></div>}
                {personal.phone && <div className="flex items-center gap-1"><Phone size={14} /><span>{personal.phone}</span></div>}
                {personal.location && <div className="flex items-center gap-1"><MapPin size={14} /><span>{personal.location}</span></div>}
                {personal.website && <div className="flex items-center gap-1"><Globe size={14} /><span>{personal.website}</span></div>}
                {personal.linkedin && <div className="flex items-center gap-1"><Linkedin size={14} /><span>{personal.linkedin}</span></div>}
                {personal.github && <div className="flex items-center gap-1"><Github size={14} /><span>{personal.github}</span></div>}
              </div>
            </div>

            {/* Summary */}
            {personal.summary && <div><SectionTitle title="Summary" /><p className="text-gray-700 leading-relaxed">{personal.summary}</p></div>}
            
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <SectionTitle title="Experience" />
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.position || "Position"}</h3>
                          <p className="text-purple-600 font-medium">{exp.company || "Company"}</p>
                        </div>
                        <span className="text-sm text-gray-500">{exp.startDate || "Start"} - {exp.endDate || "End"}</span>
                      </div>
                      {exp.description && <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <SectionTitle title="Education" />
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree || "Degree"}</h3>
                          <p className="text-purple-600">{edu.school || "School"}</p>
                          {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                        </div>
                        <span className="text-sm text-gray-500">{edu.year || "Year"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
               <div>
                <SectionTitle title="Projects" />
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{project.name || "Project Name"}</h3>
                      {project.description && <p className="text-gray-700 text-sm leading-relaxed mb-2">{project.description}</p>}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1">
                          {splitAndTrim(project.technologies).map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <SectionTitle title="Skills" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-2">{skillGroup.category || "Category"}</h3>
                      <p className="text-gray-700 text-sm">{skillGroup.items}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <SectionTitle title="Certifications" />
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-center border-l-2 border-gray-200 pl-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.name || "Certification"}</h3>
                        <p className="text-purple-600 text-sm">{cert.issuer || "Issuer"}</p>
                      </div>
                      <span className="text-sm text-gray-500">{cert.date || "Date"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
  }

  // Fallback if no template matches
  return <div className="bg-white shadow-lg rounded-lg p-8 h-full">Error: Template not found.</div>
}

export default ResumePreview
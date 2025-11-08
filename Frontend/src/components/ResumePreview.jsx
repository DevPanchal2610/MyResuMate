"use client"

import React from "react"
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react"

// Helper component for section titles to keep code DRY
const SectionTitle = ({ title }) => (
  // ✅ Added break-words here
  <h2 className="text-xl font-bold text-gray-900 mb-2 border-l-4 border-purple-500 pl-3 break-words print:break-inside-avoid">
    {title}
  </h2>
)

// ✅ 1. Wrap your component in React.forwardRef
const ResumePreview = React.forwardRef(({ resumeData, template = "modern" }, ref) => {
  const { personal = {}, education = [], experience = [], projects = [], skills = [], certifications = [] } = resumeData
  const splitAndTrim = (str) => (str ? str.split(",").map((item) => item.trim()) : [])

 const printStyles = `
  @media print {
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    /* Prevent awkward breaks */
    h1, h2, h3, h4, h5, h6 {
      break-after: avoid;
      page-break-after: avoid;
    }
    
    /* Allow content to flow naturally */
    .print\\:break-inside-auto {
      break-inside: auto;
      page-break-inside: auto;
    }

    /* ✅ NEW: Make the sidebar repeat on every printed page */
    .professional-template {
      display: block !important;
    }
    
    .professional-sidebar {
      
      left: 0 !important;
      top: 0 !important;
      width: 33.333% !important;
      height: 100vh !important;
      background-color: #1f2937 !important;
    }
    
    .professional-content {
      margin-left: 33.333% !important;
      width: 66.667% !important;
    }
  }
`;

  // ✅ 2. Define the A4 page style
  const pageStyle = `
  w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto p-5
  print:w-full print:min-h-[297mm] print:shadow-none print:m-0 print:p-5
`;

  // ✅ 3. Define the style for sections to prevent breaking
  const sectionStyle = "print:break-inside-auto";

  switch (template) {
    // =================================================================
    // TEMPLATE 2: PROFESSIONAL (Two-Column Layout)
    // =================================================================
    case "professional":
  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          h1, h2, h3, h4, h5, h6 {
            break-after: avoid;
            page-break-after: avoid;
          }
          
          .professional-wrapper {
            display: block !important;
          }
          
          .professional-sidebar-print {
            width: 30% !important;
            float: left !important;
            background-color: #1f2937 !important;
            min-height: 100vh !important;
            color: white !important;
            padding: 1rem !important;
          }
          
          .professional-content-print {
            width: 70% !important;
            float: right !important;
            min-height: 100vh !important;
            padding: 1.5rem !important;
          }
        }
        
        @media screen {
          .professional-sidebar-print {
            display: none;
          }
          .professional-content-print {
            display: none;
          }
        }
      `}</style>
      
      {/* Screen version */}
      <div ref={ref} className="professional-wrapper">
        <div className={`${pageStyle} flex font-sans overflow-hidden`}> 
          {/* Left Column (Dark) */}
          <div className="w-1/3 bg-gray-800 text-white p-4 min-h-full">
            {/* Your existing sidebar content */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-1 break-words">
                {personal.firstName || "Your"} {personal.lastName || "Name"}
              </h1>
              <p className="text-lg text-purple-300 break-words">
                {personal.title || "Professional Title"}
              </p>
            </div>

            <div className="space-y-6">
              {/* Contact */}
              <div className={sectionStyle}>
                <h2 className="text-lg font-semibold text-purple-300 uppercase tracking-wider mb-3">Contact</h2>
                <div className="space-y-2 text-sm">
                  {personal.email && <div className="flex items-center gap-2 break-words"><Mail size={14} /><span className="break-words">{personal.email}</span></div>}
                  {personal.phone && <div className="flex items-center gap-2 break-words"><Phone size={14} /><span className="break-words">{personal.phone}</span></div>}
                  {personal.location && <div className="flex items-center gap-2 break-words"><MapPin size={14} /><span className="break-words">{personal.location}</span></div>}
                  {personal.website && <div className="flex items-center gap-2 break-words"><Globe size={14} /><span className="break-words">{personal.website}</span></div>}
                  {personal.linkedin && <div className="flex items-center gap-2 break-words"><Linkedin size={14} /><span className="break-words">{personal.linkedin}</span></div>}
                  {personal.github && <div className="flex items-center gap-2 break-words"><Github size={14} /><span className="break-words">{personal.github}</span></div>}
                </div>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div className={sectionStyle}>
                  <h2 className="text-lg font-semibold text-purple-300 uppercase tracking-wider mb-3">Skills</h2>
                  <div className="space-y-3">
                    {skills.map((skillGroup, index) => (
                      <div key={index} className={sectionStyle}>
                        <h3 className="font-medium text-white break-words">{skillGroup.category || "Category"}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {splitAndTrim(skillGroup.items).map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-200 text-purple-900 text-xs rounded break-words">{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className={sectionStyle}>
                  <h2 className="text-lg font-semibold text-purple-300 uppercase tracking-wider mb-3">Education</h2>
                  <div className="space-y-3 text-sm">
                    {education.map((edu, index) => (
                      <div key={index} className={sectionStyle}>
                        <h3 className="font-semibold text-white break-words">{edu.degree || "Degree"}</h3>
                        <p className="text-gray-300 break-words">{edu.school || "School"}</p>
                        <p className="text-gray-400 text-xs break-words">{edu.year || "Year"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Light) */}
          <div className="w-2/3 bg-white p-6 space-y-4 min-h-full">
            {/* Your existing right column content - keep it all the same */}
            {personal.summary && (
              <div className={sectionStyle}>  
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Summary</h2>
                <p className="text-gray-700 leading-relaxed text-sm break-words">{personal.summary}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div className={sectionStyle}>
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Experience</h2>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className={sectionStyle}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-900 break-words">{exp.position || "Position"}</h3>
                        <p className="text-sm text-gray-500 break-words">{exp.startDate || "Start"} - {exp.endDate || "End"}</p>
                      </div>
                      <p className="text-purple-600 font-medium break-words">{exp.company || "Company"}</p>
                      <p className="mt-1 text-gray-700 text-sm leading-relaxed break-words">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div className={sectionStyle}>
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Projects</h2>
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className={sectionStyle}>
                      <h3 className="font-semibold text-gray-900 break-words">{project.name || "Project Name"}</h3>
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-800 break-words">
                          {project.url}
                        </a>
                      )}
                      <p className="mt-1 text-gray-700 text-sm leading-relaxed break-words">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {splitAndTrim(project.technologies).map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full break-words">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {certifications.length > 0 && (
              <div className={sectionStyle}>
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Certifications</h2>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className={sectionStyle}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-900 break-words">{cert.name || "Certification"}</h3>
                        <p className="text-sm text-gray-500 break-words">{cert.date || "Date"}</p>
                      </div>
                      <p className="text-purple-600 font-medium break-words">{cert.issuer || "Issuer"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

   // =================================================================
    // TEMPLATE 3: CHRONOLOGICAL (Classic, Highly ATS-Friendly)
    // =================================================================
    case "chronological":
      return (
        <>
        <style>{printStyles}</style>
        <div ref={ref} className={`${pageStyle} p-8 font-serif overflow-hidden`}>
          <header className={`text-center mb-4 ${sectionStyle}`}>
            <h1 className="text-3xl font-bold text-gray-900 break-words">
              {personal.firstName || "Your"} {personal.lastName || "Name"}
            </h1>
            <p className="text-xl text-gray-600 mt-1 break-words">{personal.title || "Professional Title"}</p>
            <div className="text-xs text-gray-500 mt-2 flex justify-center items-center flex-wrap gap-x-4 gap-y-1">
              {personal.email && <span className="break-words">{personal.email}</span>}
              {personal.phone && <span className="break-words">| {personal.phone}</span>}
              {personal.location && <span className="break-words">| {personal.location}</span>}
              {personal.linkedin && <span className="break-words">| {personal.linkedin}</span>}
              {personal.github && <span className="break-words">| {personal.github}</span>}
              {personal.website && <span className="break-words">| {personal.website}</span>}
            </div>
          </header>

          <div className="space-y-3">
            {personal.summary && (
              <section className={sectionStyle}>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-0">Summary</h2>
                <p className="text-[15px] text-gray-800 break-words">{personal.summary}</p>
              </section>
            )}

            {experience.length > 0 && (
              <section className={sectionStyle}>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-0">Experience</h2>
                <div className="space-y-1">
                  {experience.map((exp, index) => (
                    <div key={index} className={sectionStyle}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-semibold break-words">{exp.position || "Position"}</h3>
                        <p className="text-sm text-gray-600 break-words">{exp.startDate || "Start"} - {exp.endDate || "End"}</p>
                      </div>
                      <p className="font-medium text-gray-700 break-words">{exp.company || "Company"}</p>
                      <ul className="list-disc list-inside mt-1 text-gray-800 text-sm space-y-1 leading-normal">
                        {splitAndTrim(exp.description).map((desc, i) => <li key={i} className="break-words">{desc}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {projects.length > 0 && (
              <section className={sectionStyle}>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-0">Projects</h2>
                <div className="space-y-1">
                {projects.map((project, index) => (
                    <div key={index} className={sectionStyle}>
                      <h3 className="text-base font-semibold break-words">{project.name || "Project Name"}</h3>
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-800 break-words">
                          {project.url}
                        </a>
                      )}
                      <ul className="list-disc list-inside mt-0 text-gray-800 text-sm space-y-1 leading-normal">
                        {splitAndTrim(project.description).map((desc, i) => <li key={i} className="break-words">{desc}</li>)}
                      </ul>
                      {project.technologies && (
                        <p className="text-sm text-gray-600 mt-0 break-words">
                          <span className="font-semibold">Technologies:</span> {project.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section className={sectionStyle}>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-0">Education</h2>
               <div className="space-y-1">
                  {education.map((edu, index) => (
                    <div key={index} className={sectionStyle}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-semibold break-words">{edu.degree || "Degree"}</h3>
                        <p className="text-sm text-gray-600 break-words">{edu.year || "Year"}</p>
                    </div>
                      <p className="text-[13px] text-gray-700 break-words">{edu.school || "School"}</p>
                      {edu.gpa && (
                        <p className="text-[13px] text-gray-600 break-words">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {skills.length > 0 && (
               <section className={sectionStyle}>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-0">Skills</h2>
                  <div className="space-y-1">
                     {skills.map((skillGroup, index) => (
                        <div key={index} className={`flex items-baseline ${sectionStyle}`}>
                    <span className="w-1/4 font-semibold text-base break-words">{skillGroup.category || "Category"}:</span>
                    <span className="w-3/4 text-[13px] break-words">{skillGroup.items || "Your skills"}</span>
                  </div>
                  ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section className={sectionStyle}>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b pb-1 mb-1">Certifications</h2>
                  <div className="space-y-2">
                    {certifications.map((cert, index) => (
                      <div key={index} className={sectionStyle}>
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-base font-semibold break-words">{cert.name || "Certification"}</h3>
                          <p className="text-sm text-gray-600 break-words">{cert.date || "Date"}</p>
                        </div>
                        <p className="font-medium text-gray-700 break-words">{cert.issuer || "Issuer"}</p>
                      </div>
                    ))}
                  </div>
              </section>
            )}
          </div>
        </div>
        </>
      )
      
    // =================================================================
    // TEMPLATE 1: MODERN (Your original template, now in the switch)
    // =================================================================
    case "modern":
    default:
      return (
        <>
         <style>{printStyles}</style>
        <div ref={ref} className={`${pageStyle} overflow-hidden`}>
          <div className="space-y-6">
            {/* Header */}
            <div className={`text-center border-b border-gray-200 pb-6 ${sectionStyle}`}>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 break-words">
                {personal.firstName || "Your"} {personal.lastName || "Name"}
              </h1>
              <p className="text-lg text-purple-600 font-medium mb-4 break-words">{personal.title || "Your Professional Title"}</p>

              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-600">
                {personal.email && <div className="flex items-center gap-1 break-words"><Mail size={14} /><span className="break-words">{personal.email}</span></div>}
                {personal.phone && <div className="flex items-center gap-1 break-words"><Phone size={14} /><span className="break-words">{personal.phone}</span></div>}
                {personal.location && <div className="flex items-center gap-1 break-words"><MapPin size={14} /><span className="break-words">{personal.location}</span></div>}
                {personal.website && <div className="flex items-center gap-1 break-words"><Globe size={14} /><span className="break-words">{personal.website}</span></div>}
                {personal.linkedin && <div className="flex items-center gap-1 break-words"><Linkedin size={14} /><span className="break-words">{personal.linkedin}</span></div>}
                {personal.github && <div className="flex items-center gap-1 break-words"><Github size={14} /><span className="break-words">{personal.github}</span></div>}
              </div>
            </div>

            {/* Summary */}
            {personal.summary && <div className={sectionStyle}><SectionTitle title="Summary" /><p className="text-gray-700 leading-relaxed break-words">{personal.summary}</p></div>}
            
            {/* Experience */}
            {experience.length > 0 && (
              <div className={sectionStyle}>
                <SectionTitle title="Experience" />
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className={`border-l-2 border-gray-200 pl-4 ${sectionStyle}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 break-words">{exp.position || "Position"}</h3>
                          <p className="text-purple-600 font-medium break-words">{exp.company || "Company"}</p>
                        </div>
                        <span className="text-sm text-gray-500 break-words">{exp.startDate || "Start"} - {exp.endDate || "End"}</span>
                    </div>
                    {exp.description && <p className="text-gray-700 text-sm leading-relaxed break-words">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className={sectionStyle}>
                <SectionTitle title="Education" />
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index} className={`border-l-2 border-gray-200 pl-4 ${sectionStyle}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 break-words">{edu.degree || "Degree"}</h3>
                       <p className="text-purple-600 break-words">{edu.school || "School"}</p>
                          {edu.gpa && <p className="text-sm text-gray-600 break-words">GPA: {edu.gpa}</p>}
                        </div>
                        <span className="text-sm text-gray-500 break-words">{edu.year || "Year"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
               <div className={sectionStyle}>
                <SectionTitle title="Projects" />
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className={`border-l-2 border-gray-200 pl-4 ${sectionStyle}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 break-words">{project.name || "Project Name"}</h3>
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-800 break-words">
                          {project.url}
                        </a>
                      )}
                      {project.description && <p className="text-gray-700 text-sm leading-relaxed mb-2 break-words">{project.description}</p>}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1">
                          {splitAndTrim(project.technologies).map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full break-words">{tech}</span>
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
              <div className={sectionStyle}>
                <SectionTitle title="Skills" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skillGroup, index) => (
                    <div key={index} className={sectionStyle}>
                      <h3 className="font-semibold text-gray-900 mb-2 break-words">{skillGroup.category || "Category"}</h3>
                      <p className="text-gray-700 text-sm break-words">{skillGroup.items}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
            <div className={sectionStyle}>
                <SectionTitle title="Certifications" />
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                 <div key={index} className={`flex justify-between items-center border-l-2 border-gray-200 pl-4 ${sectionStyle}`}>
                      <div>
                        <h3 className="font-semibold text-gray-900 break-words">{cert.name || "Certification"}</h3>
                        <p className="text-purple-600 text-sm break-words">{cert.issuer || "Issuer"}</p>
                        </div>
                        <span className="text-sm text-gray-500 break-words">{cert.date || "Date"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
     </> )
  }

  // Fallback if no template matches
  return <div className="bg-white shadow-lg rounded-lg p-8 h-full">Error: Template not found.</div>
})

export default ResumePreview
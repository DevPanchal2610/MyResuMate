import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

// ====================================================================
// STYLESHEET
// ====================================================================

const styles = StyleSheet.create({
  // General
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 30,
    color: '#374151', 
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 20,
  },
  
  // ===================================
  // MODERN Template Styles
  // ===================================
  modernHeader: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 24,
    marginBottom: 24,
  },
  modernName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modernTitle: {
    fontSize: 18,
    color: '#4F46E5', 
    fontWeight: 'medium',
    marginBottom: 16,
  },
  modernContactWrapper: {
    // ✅ FIX: Stack contact info vertically
    flexDirection: 'column', 
    alignItems: 'center',
    gap: 4, // Use gap for spacing
    fontSize: 9,
    color: '#4B5563',
  },
  modernContactItem: {
    // This style is no longer needed
  },
  modernSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#A855F7', 
    paddingLeft: 12,
  },
  modernItemWrapper: {
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 16,
    marginBottom: 16,
  },
  modernItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  modernItemPosition: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  modernItemCompany: {
    fontSize: 10,
    color: '#4F46E5',
    fontWeight: 'medium',
  },
  modernItemDate: {
    fontSize: 9,
    color: '#6B7280',
  },
  modernSkillContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  modernSkillCategory: {
    width: '50%',
  },
  modernSkillTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modernTag: {
    fontSize: 9,
    backgroundColor: '#EDE9FE', 
    color: '#5B21B6', 
    padding: 4,
    borderRadius: 999,
  },

  // ===================================
  // PROFESSIONAL Template Styles
  // ===================================
  professionalPage: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
  },
  professionalLeftCol: {
    width: '33.33%',
    backgroundColor: '#1F2937', 
    color: '#FFFFFF',
    padding: 24,
  },
  professionalRightCol: {
    width: '66.67%',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  professionalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
  },
  professionalTitle: {
    fontSize: 16,
    color: '#C7D2FE', 
    textAlign: 'center',
    marginBottom: 24,
  },
  professionalSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C7D2FE',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  professionalContactItem: {
    // ✅ FIX: Removed icon-related styles, increased margin
    fontSize: 9,
    marginBottom: 8, 
    color: '#D1D5DB', 
  },
  professionalSkillTitle: {
    fontSize: 10,
    fontWeight: 'medium',
    color: 'white',
    marginBottom: 4,
  },
  professionalSkillTag: {
    fontSize: 9,
    backgroundColor: '#C7D2FE',
    color: '#1F2937',
    padding: 4,
    borderRadius: 4,
  },
  professionalEduItem: {
    // ✅ FIX: Increased margin for more space
    marginBottom: 12, 
  },
  professionalEduDegree: {
    fontSize: 10,
    fontWeight: 'semibold',
    color: 'white',
    // ✅ FIX: Added margin
    marginBottom: 4, 
  },
  professionalEduSchool: {
    fontSize: 9,
    color: '#D1D5DB',
    // ✅ FIX: Added margin
    marginBottom: 4, 
  },
  professionalEduYear: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  professionalMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
    marginBottom: 12,
  },
  professionalMainText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  professionalExpItem: {
    marginBottom: 16,
  },
  professionalExpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  professionalExpPosition: {
    fontSize: 11,
    fontWeight: 'semibold',
    color: '#111827',
  },
  professionalExpDate: {
    fontSize: 9,
    color: '#6B7280',
  },
  professionalExpCompany: {
    fontSize: 10,
    color: '#4F46E5',
    fontWeight: 'medium',
  },
  professionalExpDesc: {
    marginTop: 4,
    fontSize: 10,
    color: '#374151',
  },

  // ===================================
  // CHRONOLOGICAL Template Styles
  // ===================================
  chronoPage: {
    padding: 40,
    fontFamily: 'Times-Roman',
    fontSize: 11,
  },
  chronoHeader: {
    textAlign: 'center',
    marginBottom: 24,
  },
  chronoName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  chronoProfTitle: {
    fontSize: 18,
    color: '#4B5563',
    marginTop: 4,
  },
  chronoContact: {
    fontSize: 9,
    color: '#4B5563',
    marginTop: 12,
    // ✅ FIX: Stack contact info vertically
    flexDirection: 'column', 
    alignItems: 'center',
    gap: 2,
  },
  chronoSection: {
    marginBottom: 16,
  },
  chronoSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#4B5563',
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280',
    paddingBottom: 4,
    marginBottom: 12,
  },
  chronoText: {
    color: '#1F2937',
    lineHeight: 1.5,
  },
  chronoItem: {
    marginBottom: 12,
  },
  chronoItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  chronoItemPosition: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chronoItemDate: {
    fontSize: 10,
    color: '#4B5563',
  },
  chronoItemCompany: {
    fontWeight: 'medium',
    color: '#374151',
  },
  chronoDescList: {
    marginTop: 4,
    paddingLeft: 10, 
  },
  chronoDescItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  chronoBullet: {
    width: 10,
    fontSize: 10,
  },
  chronoDescText: {
    flex: 1,
    fontSize: 10,
  },
  chronoSkillRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  chronoSkillCategory: {
    width: '25%',
    fontWeight: 'bold',
    fontSize: 10,
  },
  chronoSkillItems: {
    width: '75%',
    fontSize: 10,
  },

  // General Helpers
  flexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
});

// ====================================================================
// PDF DOCUMENT COMPONENT
// ====================================================================

const ResumeDocument = ({ resumeData, template = "modern" }) => {
  const { personal = {}, education = [], experience = [], projects = [], skills = [], certifications = [] } = resumeData;
  const splitAndTrim = (str) => (str ? str.split(",").map((item) => item.trim()) : []);

  // Helper for bulleted lists
  const BulletList = ({ text }) => {
    const items = splitAndTrim(text);
    return (
      <View style={styles.chronoDescList}>
        {items.map((item, i) => (
          <View key={i} style={styles.chronoDescItem}>
            <Text style={styles.chronoBullet}>•</Text>
            <Text style={styles.chronoDescText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };


  switch (template) {
    // =================================================================
    // TEMPLATE 1: MODERN
    // =================================================================
    case "modern":
      return (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.modernPage}>
              {/* Header */}
              <View style={styles.modernHeader}>
                <Text style={styles.modernName}>{personal.firstName} {personal.lastName}</Text>
                <Text style={styles.modernTitle}>{personal.title}</Text>
                
                {/* ✅ FIX: Removed icons, stacked text vertically */}
                <View style={styles.modernContactWrapper}>
                  {personal.email && <Text>{personal.email}</Text>}
                  {personal.phone && <Text>{personal.phone}</Text>}
                  {personal.location && <Text>{personal.location}</Text>}
                  {personal.website && <Text>{personal.website}</Text>}
                  {personal.linkedin && <Text>{personal.linkedin}</Text>}
                  {personal.github && <Text>{personal.github}</Text>}
                </View>
              </View>

              {/* ... (Rest of Modern template is unchanged) ... */}
              {/* Summary */}
              {personal.summary && (
                <View style={styles.modernSection}>
                  <Text style={styles.modernSectionTitle}>Summary</Text>
                  <Text style={styles.modernText}>{personal.summary}</Text>
                </View>
              )}
              {/* Experience */}
              {experience.length > 0 && (
                <View style={styles.modernSection}>
                  <Text style={styles.modernSectionTitle}>Experience</Text>
                  {experience.map((exp, index) => (
                    <View key={index} style={styles.modernItemWrapper}>
                      <View style={styles.modernItemHeader}>
                        <View style={{ width: '80%' }}>
                          <Text style={styles.modernItemPosition}>{exp.position}</Text>
                          <Text style={styles.modernItemCompany}>{exp.company}</Text>
                        </View>
                        <Text style={styles.modernItemDate}>{exp.startDate} - {exp.endDate}</Text>
                      </View>
                      {exp.description && <Text style={styles.modernText}>{exp.description}</Text>}
                    </View>
                  ))}
                </View>
              )}
              {/* Education */}
              {education.length > 0 && (
                <View style={styles.modernSection}>
                  <Text style={styles.modernSectionTitle}>Education</Text>
                  {education.map((edu, index) => (
                    <View key={index} style={styles.modernItemWrapper}>
                      <View style={styles.modernItemHeader}>
                        <View>
                          <Text style={styles.modernItemPosition}>{edu.degree}</Text>
                          <Text style={styles.modernItemCompany}>{edu.school}</Text>
                          {edu.gpa && <Text style={styles.modernText}>GPA: {edu.gpa}</Text>}
                        </View>
                        <Text style={styles.modernItemDate}>{edu.year}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {/* Projects */}
              {projects.length > 0 && (
               <View style={styles.modernSection}>
                <Text style={styles.modernSectionTitle}>Projects</Text>
                  {projects.map((project, index) => (
                    <View key={index} style={styles.modernItemWrapper}>
                      <Text style={styles.modernItemPosition}>{project.name}</Text>
                      {project.description && <Text style={styles.modernText}>{project.description}</Text>}
                      {project.technologies && (
                        <View style={styles.flexWrap}>
                          {splitAndTrim(project.technologies).map((tech, i) => (
                            <Text key={i} style={styles.modernTag}>{tech}</Text>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
              {/* Skills */}
              {skills.length > 0 && (
                <View style={styles.modernSection}>
                  <Text style={styles.modernSectionTitle}>Skills</Text>
                  <View style={styles.modernSkillContainer}>
                    {skills.map((skillGroup, index) => (
                      <View key={index} style={styles.modernSkillCategory}>
                        <Text style={styles.modernSkillTitle}>{skillGroup.category}</Text>
                        <Text style={styles.modernText}>{skillGroup.items}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {/* Certifications */}
              {certifications.length > 0 && (
                <View style={styles.modernSection}>
                  <Text style={styles.modernSectionTitle}>Certifications</Text>
                  {certifications.map((cert, index) => (
                    <View key={index} style={styles.modernItemWrapper}>
                      <View style={styles.modernItemHeader}>
                        <View>
                          <Text style={styles.modernItemPosition}>{cert.name}</Text>
                          <Text style={styles.modernItemCompany}>{cert.issuer}</Text>
                        </View>
                        <Text style={styles.modernItemDate}>{cert.date}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Page>
        </Document>
      );

    // =================================================================
    // TEMPLATE 2: PROFESSIONAL
    // =================================================================
    case "professional":
      return (
        <Document>
          <Page size="A4" style={styles.professionalPage}>
            {/* Left Column */}
            <View style={styles.professionalLeftCol}>
              <Text style={styles.professionalName}>{personal.firstName} {personal.lastName}</Text>
              <Text style={styles.professionalTitle}>{personal.title}</Text>

              <View style={styles.section}>
                <Text style={styles.professionalSectionTitle}>Contact</Text>
                {/* ✅ FIX: Removed icons, text will stack */}
                {personal.email && <Text style={styles.professionalContactItem}>{personal.email}</Text>}
                {personal.phone && <Text style={styles.professionalContactItem}>{personal.phone}</Text>}
                {personal.location && <Text style={styles.professionalContactItem}>{personal.location}</Text>}
                {personal.website && <Text style={styles.professionalContactItem}>{personal.website}</Text>}
                {personal.linkedin && <Text style={styles.professionalContactItem}>{personal.linkedin}</Text>}
                {personal.github && <Text style={styles.professionalContactItem}>{personal.github}</Text>}
              </View>

              {skills.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.professionalSectionTitle}>Skills</Text>
                  {skills.map((skillGroup, index) => (
                    <View key={index} style={{ marginBottom: 8 }}>
                      <Text style={styles.professionalSkillTitle}>{skillGroup.category}</Text>
                      <View style={styles.flexWrap}>
                        {splitAndTrim(skillGroup.items).map((skill, i) => (
                          <Text key={i} style={styles.professionalSkillTag}>{skill}</Text>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {education.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.professionalSectionTitle}>Education</Text>
                  {education.map((edu, index) => (
                    // ✅ FIX: Added spacing here
                    <View key={index} style={styles.professionalEduItem}> 
                      <Text style={styles.professionalEduDegree}>{edu.degree}</Text>
                      <Text style={styles.professionalEduSchool}>{edu.school}</Text>
                      <Text style={styles.professionalEduYear}>{edu.year}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            
            {/* Right Column */}
            <View style={styles.professionalRightCol}>
              {/* ... (Rest of Professional template is unchanged) ... */}
              {personal.summary && (
                <View style={styles.section}>
                  <Text style={styles.professionalMainTitle}>Summary</Text>
                  <Text style={styles.professionalMainText}>{personal.summary}</Text>
                </View>
              )}
              {experience.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.professionalMainTitle}>Experience</Text>
                  {experience.map((exp, index) => (
                    <View key={index} style={styles.professionalExpItem}>
                      <View style={styles.professionalExpHeader}>
                        <Text style={styles.professionalExpPosition}>{exp.position}</Text>
                        <Text style={styles.professionalExpDate}>{exp.startDate} - {exp.endDate}</Text>
                      </View>
                      <Text style={styles.professionalExpCompany}>{exp.company}</Text>
                      <Text style={styles.professionalExpDesc}>{exp.description}</Text>
                    </View>
                  ))}
                </View>
              )}
              {projects.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.professionalMainTitle}>Projects</Text>
                  {projects.map((project, index) => (
                    <View key={index} style={styles.professionalExpItem}>
                      <Text style={styles.professionalExpPosition}>{project.name}</Text>
                      <Text style={styles.professionalExpDesc}>{project.description}</Text>
                       {project.technologies && (
                        <View style={styles.flexWrap}>
                          {splitAndTrim(project.technologies).map((tech, techIndex) => (
                            <Text key={techIndex} style={{ ...styles.professionalSkillTag, backgroundColor: '#E5E7EB', color: '#374151' }}>{tech}</Text>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
              {certifications.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.professionalMainTitle}>Certifications</Text>
                  {certifications.map((cert, index) => (
                    <View key={index} style={styles.professionalExpItem}>
                      <View style={styles.professionalExpHeader}>
                        <Text style={styles.professionalExpPosition}>{cert.name}</Text>
                        <Text style={styles.professionalExpDate}>{cert.date}</Text>
                      </View>
                      <Text style={styles.professionalExpCompany}>{cert.issuer}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Page>
        </Document>
      )

    // =================================================================
    // TEMPLATE 3: CHRONOLOGICAL
    // =================================================================
    case "chronological":
      return (
        <Document>
          <Page size="A4" style={styles.chronoPage}>
            <View>
              <View style={styles.chronoHeader}>
                <Text style={styles.chronoName}>{personal.firstName} {personal.lastName}</Text>
                <Text style={styles.chronoProfTitle}>{personal.title}</Text>
                <View style={styles.chronoContact}>
                  {/* ✅ FIX: Removed icons/separators, stacked text vertically */}
                  {personal.email && <Text>{personal.email}</Text>}
                  {personal.phone && <Text>{personal.phone}</Text>}
                  {personal.location && <Text>{personal.location}</Text>}
                  {personal.linkedin && <Text>{personal.linkedin}</Text>}
                  {personal.github && <Text>{personal.github}</Text>}
                </View>
              </View>

              {/* ... (Rest of Chronological template is unchanged) ... */}
              {personal.summary && (
                <View style={styles.chronoSection}>
                  <Text style={styles.chronoSectionTitle}>Summary</Text>
                  <Text style={styles.chronoText}>{personal.summary}</Text>
                </View>
              )}
              {experience.length > 0 && (
                <View style={styles.chronoSection}>
                  <Text style={styles.chronoSectionTitle}>Experience</Text>
                  {experience.map((exp, index) => (
                    <View key={index} style={styles.chronoItem}>
                      <View style={styles.chronoItemHeader}>
                        <Text style={styles.chronoItemPosition}>{exp.position}</Text>
                        <Text style={styles.chronoItemDate}>{exp.startDate} - {exp.endDate}</Text>
                      </View>
                      <Text style={styles.chronoItemCompany}>{exp.company}</Text>
                      <BulletList text={exp.description} />
                    </View>
                  ))}
                </View>
              )}
              {projects.length > 0 && (
                <View style={styles.chronoSection}>
                  <Text style={styles.chronoSectionTitle}>Projects</Text>
                  {projects.map((project, index) => (
                    <View key={index} style={styles.chronoItem}>
                      <Text style={styles.chronoItemPosition}>{project.name}</Text>
                      <BulletList text={project.description} />
                       {project.technologies && (
                        <View style={{ ...styles.chronoSkillRow, marginTop: 4 }}>
                          <Text style={{...styles.chronoSkillCategory, fontWeight: 'bold' }}>Technologies:</Text>
                          <Text style={styles.chronoSkillItems}>{project.technologies}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
              {education.length > 0 && (
                <View style={styles.chronoSection}>
                  <Text style={styles.chronoSectionTitle}>Education</Text>
                  {education.map((edu, index) => (
                    <View key={index} style={styles.chronoItem}>
                      <View style={styles.chronoItemHeader}>
                        <View>
                          <Text style={styles.chronoItemPosition}>{edu.degree}</Text>
                          <Text style={styles.chronoItemCompany}>{edu.school}</Text>
                        </View>
                       <Text style={styles.chronoItemDate}>{edu.year}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {skills.length > 0 && (
                <View style={styles.chronoSection}>
                    <Text style={styles.chronoSectionTitle}>Skills</Text>
                     {skills.map((skillGroup, index) => (
                        <View key={index} style={styles.chronoSkillRow}>
                           <Text style={styles.chronoSkillCategory}>{skillGroup.category}:</Text>
                           <Text style={styles.chronoSkillItems}>{skillGroup.items}</Text>
                        </View>
                     ))}
                </View>
              )}
              {certifications.length > 0 && (
                <View style={styles.chronoSection}>
                  <Text style={styles.chronoSectionTitle}>Certifications</Text>
                  {certifications.map((cert, index) => (
                    <View key={index} style={styles.chronoItem}>
                      <View style={styles.chronoItemHeader}>
                        <Text style={styles.chronoItemPosition}>{cert.name}</Text>
                        <Text style={styles.chronoItemDate}>{cert.date}</Text>
                      </View>
                      <Text style={styles.chronoItemCompany}>{cert.issuer}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Page>
        </Document>
      )
      
    // =================================================================
    // DEFAULT FALLBACK
    // =================================================================
    default:
      return (
        <Document>
          <Page size="A4" style={styles.page}>
            <Text>Template not found or not yet supported for PDF export.</Text>
          </Page>
        </Document>
      );
  }
};

export default ResumeDocument;
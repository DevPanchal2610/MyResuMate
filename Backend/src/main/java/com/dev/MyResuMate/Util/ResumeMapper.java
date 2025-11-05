package com.dev.MyResuMate.Util;

import com.dev.MyResuMate.DTO.*;
import com.dev.MyResuMate.Model.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList; // ✅ Import ArrayList
import java.util.stream.Collectors;

@Component
public class ResumeMapper {

    // This is the main mapping function
    public Resume mapDtoToEntity(ResumeDataDTO dto, Resume resume, User user, ResumeTemplate template) {
        resume.setUser(user);
        resume.setTemplate(template);
        resume.setResumeTitle(dto.getResumeTitle());

        // Map child objects
        resume.setPersonalInfo(mapPersonalInfo(dto.getPersonal(), resume.getPersonalInfo(), resume));

        // ❗️ vvvvvv THIS IS THE CORRECTED LOGIC vvvvvv
        // We now check if the list from the DTO is null before trying to stream it.
        // We also call the 'setEducation' helper method from Resume.java

        resume.setEducation(
                dto.getEducation() == null ? new ArrayList<>() :
                        dto.getEducation().stream()
                                .map(eduDto -> mapEducation(eduDto, resume))
                                .collect(Collectors.toList())
        );

        resume.setExperience(
                dto.getExperience() == null ? new ArrayList<>() :
                        dto.getExperience().stream()
                                .map(expDto -> mapExperience(expDto, resume))
                                .collect(Collectors.toList())
        );

        resume.setProjects(
                dto.getProjects() == null ? new ArrayList<>() :
                        dto.getProjects().stream()
                                .map(projDto -> mapProject(projDto, resume))
                                .collect(Collectors.toList())
        );

        resume.setSkills(
                dto.getSkills() == null ? new ArrayList<>() :
                        dto.getSkills().stream()
                                .map(skillDto -> mapSkill(skillDto, resume))
                                .collect(Collectors.toList())
        );

        resume.setCertifications(
                dto.getCertifications() == null ? new ArrayList<>() :
                        dto.getCertifications().stream()
                                .map(certDto -> mapCertification(certDto, resume))
                                .collect(Collectors.toList())
        );
        // ❗️ ^^^^^^ END OF CORRECTED LOGIC ^^^^^^

        return resume;
    }

    // --- (All the helper mappers below are correct, no changes needed) ---

    private ResumePersonalInfo mapPersonalInfo(PersonalInfoDTO dto, ResumePersonalInfo info, Resume resume) {
        if (dto == null) return null;
        // If the existing 'info' is null (like in a new resume), create it
        if (info == null) {
            info = new ResumePersonalInfo();
            info.setResume(resume);
        }
        info.setFirstName(dto.getFirstName());
        info.setLastName(dto.getLastName());
        info.setProfessionalTitle(dto.getTitle()); // Mapped from 'title'
        info.setEmail(dto.getEmail());
        info.setPhone(dto.getPhone());
        info.setLocation(dto.getLocation());
        info.setWebsite(dto.getWebsite());
        info.setLinkedin(dto.getLinkedin());
        info.setGithub(dto.getGithub());
        info.setProfessionalSummary(dto.getSummary()); // Mapped from 'summary'
        return info;
    }

    private ResumeEducation mapEducation(EducationDTO dto, Resume resume) {
        ResumeEducation edu = new ResumeEducation();
        edu.setResume(resume);
        edu.setDegree(dto.getDegree());
        edu.setSchool(dto.getSchool());
        edu.setGraduationYear(dto.getYear()); // Mapped from 'year'
        edu.setGpa(dto.getGpa());
        return edu;
    }

    private ResumeExperience mapExperience(ExperienceDTO dto, Resume resume) {
        ResumeExperience exp = new ResumeExperience();
        exp.setResume(resume);
        exp.setPosition(dto.getPosition());
        exp.setCompany(dto.getCompany());
        exp.setStartDate(dto.getStartDate());
        exp.setEndDate(dto.getEndDate());
        exp.setDescription(dto.getDescription());
        return exp;
    }

    private ResumeProject mapProject(ProjectDTO dto, Resume resume) {
        ResumeProject proj = new ResumeProject();
        proj.setResume(resume);
        proj.setProjectName(dto.getName()); // Mapped from 'name'
        proj.setDescription(dto.getDescription());
        proj.setTechnologies(dto.getTechnologies());
        proj.setProjectUrl(dto.getUrl()); // Mapped from 'url'
        return proj;
    }

    private ResumeSkill mapSkill(SkillDTO dto, Resume resume) {
        ResumeSkill skill = new ResumeSkill();
        skill.setResume(resume);
        skill.setSkillCategory(dto.getCategory());
        skill.setSkillsList(dto.getItems()); // Mapped from 'items'
        return skill;
    }

    private ResumeCertification mapCertification(CertificationDTO dto, Resume resume) {
        ResumeCertification cert = new ResumeCertification();
        cert.setResume(resume);
        cert.setCertificationName(dto.getName()); // Mapped from 'name'
        cert.setIssuer(dto.getIssuer());
        cert.setDateObtained(dto.getDate()); // Mapped from 'date'
        return cert;
    }

    public ResumeFullDTO mapEntityToFullDTO(Resume resume) {
        ResumeFullDTO dto = new ResumeFullDTO();
        dto.setResumeId(resume.getId());
        dto.setResumeTitle(resume.getResumeTitle());

        // Make sure template is not null before getting key
        if (resume.getTemplate() != null) {
            dto.setTemplateKey(resume.getTemplate().getTemplateKey());
        }

        dto.setPersonal(mapPersonalInfoToDTO(resume.getPersonalInfo()));

        dto.setEducation(resume.getEducation().stream()
                .map(this::mapEducationToDTO)
                .collect(Collectors.toList()));

        dto.setExperience(resume.getExperience().stream()
                .map(this::mapExperienceToDTO)
                .collect(Collectors.toList()));

        dto.setProjects(resume.getProjects().stream()
                .map(this::mapProjectToDTO)
                .collect(Collectors.toList()));

        dto.setSkills(resume.getSkills().stream()
                .map(this::mapSkillToDTO)
                .collect(Collectors.toList()));

        dto.setCertifications(resume.getCertifications().stream()
                .map(this::mapCertificationToDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    // --- Helper mappers for each section ---

    private PersonalInfoDTO mapPersonalInfoToDTO(ResumePersonalInfo info) {
        // Return an empty object if no personal info exists
        if (info == null) return new PersonalInfoDTO();

        PersonalInfoDTO dto = new PersonalInfoDTO();
        dto.setFirstName(info.getFirstName());
        dto.setLastName(info.getLastName());
        dto.setTitle(info.getProfessionalTitle());
        dto.setEmail(info.getEmail());
        dto.setPhone(info.getPhone());
        dto.setLocation(info.getLocation());
        dto.setWebsite(info.getWebsite());
        dto.setLinkedin(info.getLinkedin());
        dto.setGithub(info.getGithub());
        dto.setSummary(info.getProfessionalSummary());
        return dto;
    }

    private EducationDTO mapEducationToDTO(ResumeEducation edu) {
        EducationDTO dto = new EducationDTO();
        dto.setDegree(edu.getDegree());
        dto.setSchool(edu.getSchool());
        dto.setYear(edu.getGraduationYear());
        dto.setGpa(edu.getGpa());
        return dto;
    }

    private ExperienceDTO mapExperienceToDTO(ResumeExperience exp) {
        ExperienceDTO dto = new ExperienceDTO();
        dto.setPosition(exp.getPosition());
        dto.setCompany(exp.getCompany());
        dto.setStartDate(exp.getStartDate());
        dto.setEndDate(exp.getEndDate());
        dto.setDescription(exp.getDescription());
        return dto;
    }

    private ProjectDTO mapProjectToDTO(ResumeProject proj) {
        ProjectDTO dto = new ProjectDTO();
        dto.setName(proj.getProjectName());
        dto.setDescription(proj.getDescription());
        dto.setTechnologies(proj.getTechnologies());
        dto.setUrl(proj.getProjectUrl());
        return dto;
    }

    private SkillDTO mapSkillToDTO(ResumeSkill skill) {
        SkillDTO dto = new SkillDTO();
        dto.setCategory(skill.getSkillCategory());
        dto.setItems(skill.getSkillsList());
        return dto;
    }

    private CertificationDTO mapCertificationToDTO(ResumeCertification cert) {
        CertificationDTO dto = new CertificationDTO();
        dto.setName(cert.getCertificationName());
        dto.setIssuer(cert.getIssuer());
        dto.setDate(cert.getDateObtained());
        return dto;
    }
}
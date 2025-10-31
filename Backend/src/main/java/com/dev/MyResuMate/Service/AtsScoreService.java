package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AtsScoreService {

    private static final Set<String> ACTION_VERBS = Set.of(
            "developed", "created", "built", "designed", "implemented", "led", "managed", "optimized",
            "integrated", "streamlined", "architected", "engineered", "achieved", "improved", "increased",
            "reduced", "generated", "negotiated", "mentored", "trained", "presented", "published", "drove",
            "spearheaded", "executed", "launched", "pioneered", "revitalized", "restructured"
    );

    // This is a new public method that returns both the score and the feedback.
    public ScoreWithFeedback analyzeAndScore(Resume1 content, DesignAnalysis design) {
        List<FeedbackItem> feedback = new ArrayList<>();

        // Each category is scored out of 100, then weighted.
        // Weights are re-balanced to focus less on pure keywords.
        double completenessScore = scoreCompleteness(content, feedback) * 0.10;       // 10%
        double formatScore = scoreFormatAndCompatibility(design, feedback) * 0.20; // 20%
        double impactScore = scoreImpactAndMeasurability(content, feedback) * 0.30;     // 30% (Increased weight)
        double brevityScore = scoreClarityAndBrevity(content, feedback) * 0.25;         // 25% (Increased weight)
        double keywordScore = scoreKeywordOptimization(content, feedback) * 0.15;       // 15% (Decreased weight)

        double finalScore = completenessScore + formatScore + keywordScore + impactScore + brevityScore;

        return new ScoreWithFeedback((int) Math.round(finalScore), feedback);
    }

    // A simple inner record to return two values from the main method.
    public record ScoreWithFeedback(int score, List<FeedbackItem> feedback) {}


    private int scoreCompleteness(Resume1 content, List<FeedbackItem> feedback) {
        int points = 0;
        if (content.contact_info() != null && StringUtils.hasText(content.contact_info().email()) && StringUtils.hasText(content.contact_info().phone())) {
            points += 40;
            feedback.add(new FeedbackItem(FeedbackType.GOOD_PRACTICE, "Contact Info", "Essential contact information (email, phone) is present."));
        } else {
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Contact Info", "Your resume may be missing a phone number or email. Ensure both are clearly listed."));
        }

        if (StringUtils.hasText(content.profile_summary())) {
            points += 20;
            feedback.add(new FeedbackItem(FeedbackType.GOOD_PRACTICE, "Summary", "A professional summary is included."));
        } else {
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Summary", "Consider adding a 2-3 sentence professional summary at the top to introduce yourself."));
        }

        if (content.education() != null && !content.education().isEmpty()) {
            points += 20;
        } else {
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Education", "An education section is a required component of a standard resume."));
        }

        if (content.skills() != null) {
            points += 20;
            feedback.add(new FeedbackItem(FeedbackType.GOOD_PRACTICE, "Skills", "A dedicated skills section helps ATS systems quickly identify your capabilities."));
        } else {
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Skills", "Add a dedicated 'Skills' section to list your technical and soft skills."));
        }
        return points;
    }

    private int scoreFormatAndCompatibility(DesignAnalysis design, List<FeedbackItem> feedback) {
        int score = 100;
        if (design.has_photo()) {
            score -= 50;
            feedback.add(new FeedbackItem(FeedbackType.CRITICAL_ISSUE, "Formatting", "Resumes with photos can be automatically rejected by many ATS. It's highly recommended to remove it."));
        }
        if (design.uses_columns_or_tables()) {
            score -= 40;
            feedback.add(new FeedbackItem(FeedbackType.CRITICAL_ISSUE, "Formatting", "Your resume appears to use columns or tables, which can confuse older ATS parsers, scrambling your information."));
        }
        if (design.font_count() > 2) {
            score -= 20;
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Formatting", "Using more than two fonts can look unprofessional. Stick to one font for headings and one for body text."));
        }
        if (score == 100) {
            feedback.add(new FeedbackItem(FeedbackType.GOOD_PRACTICE, "Formatting", "Your resume has a clean, single-column format with no photos, making it highly compatible with ATS."));
        }
        return Math.max(0, score);
    }

    private int scoreImpactAndMeasurability(Resume1 content, List<FeedbackItem> feedback) {
        Pattern measurablePattern = Pattern.compile("(\\d+%|\\$\\d+|\\d[kKmMbB]?|\\d{2,})");
        List<String> allBulletPoints = getAllBulletPoints(content);
        if (allBulletPoints.isEmpty()) {
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Impact", "Add descriptive bullet points under each project or experience to detail your achievements."));
            return 20;
        }

        long measurableCount = allBulletPoints.stream().filter(desc -> measurablePattern.matcher(desc).find()).count();
        double ratio = (double) measurableCount / allBulletPoints.size();

        if (ratio >= 0.25) {
            feedback.add(new FeedbackItem(FeedbackType.GOOD_PRACTICE, "Impact", "Excellent use of quantifiable metrics and numbers to demonstrate your impact."));
            return 100;
        } else if (ratio > 0) {
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Impact", "You've started using metrics, which is great! Try to add more quantifiable results (like %, $, or numbers) to your bullet points to show tangible achievements."));
            return 70;
        } else {
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Impact", "Strengthen your resume by adding measurable results. For example, instead of 'Improved performance', try 'Improved performance by 15%'."));
            return 20;
        }
    }

    private int scoreClarityAndBrevity(Resume1 content, List<FeedbackItem> feedback) {
        int score = 100;
        if (content.profile_summary() != null) {
            int summaryLength = content.profile_summary().split("\\s+").length;
            if (summaryLength < 20) {
                score -= 40;
                feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Clarity", "Your professional summary is very brief. Consider expanding it to 2-3 sentences to better highlight your key qualifications."));
            } else if (summaryLength > 60) {
                score -= 40;
                feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Clarity", "Your summary is a bit long. Aim for a concise 2-3 sentence summary that is easy for recruiters to scan quickly."));
            }
        }
        // ... (add other clarity checks if needed)
        return Math.max(0, score);
    }

    private int scoreKeywordOptimization(Resume1 content, List<FeedbackItem> feedback) {
        List<String> allBulletPoints = getAllBulletPoints(content);
        if (allBulletPoints.isEmpty()) return 0;

        // Action Verb Usage
        long actionVerbCount = allBulletPoints.stream().filter(desc -> ACTION_VERBS.contains(desc.trim().split(" ")[0].toLowerCase())).count();
        double actionVerbRatio = (double) actionVerbCount / allBulletPoints.size();

        if (actionVerbRatio < 0.5) {
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Keywords", "Start each bullet point with a strong action verb (e.g., 'Developed', 'Managed', 'Optimized') to create more impact."));
        } else {
            feedback.add(new FeedbackItem(FeedbackType.GOOD_PRACTICE, "Keywords", "Great job starting your bullet points with strong action verbs."));
        }

        // Skill Contextualization
        Set<String> hardSkills = getHardSkills(content.skills());
        if (hardSkills.isEmpty()) return (int) (actionVerbRatio * 100);

        long skillsMentioned = hardSkills.stream().filter(skill -> allBulletPoints.stream().anyMatch(desc -> desc.toLowerCase().contains(skill.toLowerCase()))).count();
        double skillMentionRatio = (double) skillsMentioned / hardSkills.size();

        if (skillMentionRatio < 0.3) {
            feedback.add(new FeedbackItem(FeedbackType.IMPROVEMENT, "Keywords", "Try to mention more of the skills from your skills section within your project or experience descriptions to show how you applied them."));
        }

        // Final keyword score is a mix of both metrics
        return (int) ((actionVerbRatio * 60) + (skillMentionRatio * 40));
    }

    private List<String> getAllBulletPoints(Resume1 content) {
        return Stream.concat(
                        (content.projects() != null ? content.projects().stream() : Stream.empty()),
                        (content.work_experience() != null ? content.work_experience().stream() : Stream.empty())
                ).flatMap(exp -> exp.description() != null ? exp.description().stream() : Stream.empty())
                .collect(Collectors.toList());
    }

    private Set<String> getHardSkills(Skills skills) {
        if (skills == null) return Set.of();
        return Stream.of(skills.backend(), skills.database(), skills.frontend(), skills.others(), skills.operating_system())
                .flatMap(list -> list != null ? list.stream() : Stream.empty())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }
}
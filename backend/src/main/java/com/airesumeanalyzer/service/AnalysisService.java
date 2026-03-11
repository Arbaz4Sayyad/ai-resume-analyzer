package com.airesumeanalyzer.service;

import com.airesumeanalyzer.dto.MatchAnalysisResponse;
import com.airesumeanalyzer.exception.ResourceNotFoundException;
import com.airesumeanalyzer.model.Resume;
import com.airesumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final ResumeRepository resumeRepository;
    private final AiServiceClient aiServiceClient;

    public MatchAnalysisResponse matchResumeToJob(Long resumeId, String jobDescription, Long userId) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", resumeId));

        if (resume.getUser() == null || !resume.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Resume", resumeId);
        }

        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new RuntimeException("Resume text could not be extracted");
        }

        Map<String, Object> result =
                aiServiceClient.analyzeResumeMatch(resumeText, jobDescription != null ? jobDescription : "");

        if (result == null) {
            throw new RuntimeException("AI service returned no result");
        }

        List<String> matchingSkills = (List<String>) result.getOrDefault("matching_skills", List.of());
        List<String> missingSkills = (List<String>) result.getOrDefault("missing_skills", List.of());
        List<String> experienceGaps = (List<String>) result.getOrDefault("experience_gaps", List.of());
        List<String> suggestions = (List<String>) result.getOrDefault("suggestions", List.of());

        Integer atsScore = result.get("ats_score") != null
                ? ((Number) result.get("ats_score")).intValue()
                : null;

        return MatchAnalysisResponse.builder()
                .atsScore(atsScore)
                .matchingSkills(matchingSkills)
                .missingSkills(missingSkills)
                .experienceGaps(experienceGaps)
                .suggestions(suggestions)
                .build();
    }
}
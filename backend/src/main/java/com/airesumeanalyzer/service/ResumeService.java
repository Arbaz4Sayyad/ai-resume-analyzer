package com.airesumeanalyzer.service;

import com.airesumeanalyzer.dto.*;
import com.airesumeanalyzer.exception.ResourceNotFoundException;
import com.airesumeanalyzer.model.AnalysisResult;
import com.airesumeanalyzer.model.Resume;
import com.airesumeanalyzer.model.ResumeSuggestion;
import com.airesumeanalyzer.repository.AnalysisResultRepository;
import com.airesumeanalyzer.repository.ResumeRepository;
import com.airesumeanalyzer.repository.ResumeSuggestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private final ResumeSuggestionRepository suggestionRepository;
    private final ResumeTextExtractor textExtractor;
    private final AiServiceClient aiServiceClient;

    public ResumeUploadResponse uploadResume(MultipartFile file, Long userId) throws IOException {
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException("File name is required");
        }

        String extractedText = textExtractor.extractText(file.getInputStream(), fileName);

        Resume resume = Resume.builder()
                .userId(userId)
                .fileName(fileName)
                .extractedText(extractedText)
                .build();

        resume = resumeRepository.save(resume);

        return ResumeUploadResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .extractedText(resume.getExtractedText())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }

    public AnalysisResponse analyze(Long resumeId, Long userId, String jobDescription) {
        Resume resume = getResumeOrThrow(resumeId, userId);

        Map<String, Object> atsResult = aiServiceClient.getAtsScore(resume.getExtractedText(), jobDescription);
        Map<String, List<String>> questions = aiServiceClient.generateQuestions(resume.getExtractedText(), jobDescription);

        @SuppressWarnings("unchecked")
        List<String> matchedSkills = (List<String>) atsResult.getOrDefault("matched_skills", List.of());
        @SuppressWarnings("unchecked")
        List<String> missingSkills = (List<String>) atsResult.getOrDefault("missing_skills", List.of());
        @SuppressWarnings("unchecked")
        List<String> recommendations = (List<String>) atsResult.getOrDefault("recommendations", List.of());

        Integer atsScore = atsResult.get("ats_score") != null
                ? ((Number) atsResult.get("ats_score")).intValue()
                : null;

        AnalysisResult result = AnalysisResult.builder()
                .resumeId(resumeId)
                .atsScore(atsScore)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .interviewQuestions(questions)
                .build();
        analysisResultRepository.save(result);

        return AnalysisResponse.builder()
                .atsScore(atsScore)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .recommendations(recommendations)
                .interviewQuestions(questions)
                .build();
    }

    public CompareResponse compare(Long resumeId, Long userId, String jobDescription) {
        Resume resume = getResumeOrThrow(resumeId, userId);
        return aiServiceClient.compareJobDescription(resume.getExtractedText(), jobDescription);
    }

    public Map<String, List<String>> getQuestions(Long resumeId, Long userId, String jobDescription) {
        Resume resume = getResumeOrThrow(resumeId, userId);

        if (jobDescription != null && !jobDescription.isBlank()) {
            return aiServiceClient.generateQuestions(resume.getExtractedText(), jobDescription);
        }

        return analysisResultRepository.findFirstByResumeIdOrderByCreatedAtDesc(resumeId)
                .map(AnalysisResult::getInterviewQuestions)
                .orElseGet(() -> aiServiceClient.generateQuestions(resume.getExtractedText(), ""));
    }

    public SuggestionsResponse getSuggestions(Long resumeId, Long userId, String jobDescription) {
        Resume resume = getResumeOrThrow(resumeId, userId);
        Map<String, Object> result = aiServiceClient.getResumeSuggestions(resume.getExtractedText(), jobDescription);

        @SuppressWarnings("unchecked")
        List<String> missingKeywords = (List<String>) result.getOrDefault("missing_keywords", List.of());
        @SuppressWarnings("unchecked")
        List<String> improvementSuggestions = (List<String>) result.getOrDefault("improvement_suggestions", List.of());

        Integer resumeScore = result.get("resume_score") != null
                ? ((Number) result.get("resume_score")).intValue()
                : null;
        String optimizedSummary = (String) result.get("optimized_summary");

        ResumeSuggestion suggestion = ResumeSuggestion.builder()
                .resumeId(resumeId)
                .resumeScore(resumeScore)
                .missingKeywords(missingKeywords)
                .improvementSuggestions(improvementSuggestions)
                .optimizedSummary(optimizedSummary)
                .build();
        suggestionRepository.save(suggestion);

        return SuggestionsResponse.builder()
                .resumeScore(resumeScore)
                .missingKeywords(missingKeywords)
                .improvementSuggestions(improvementSuggestions)
                .optimizedSummary(optimizedSummary)
                .build();
    }

    public ChatResponse chat(Long resumeId, Long userId, String jobDescription, String question) {
        Resume resume = getResumeOrThrow(resumeId, userId);
        String answer = aiServiceClient.resumeChat(resume.getExtractedText(), jobDescription, question);
        return ChatResponse.builder().answer(answer).build();
    }

    public List<ResumeUploadResponse> listResumes(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId).stream()
                .map(r -> ResumeUploadResponse.builder()
                        .id(r.getId())
                        .fileName(r.getFileName())
                        .extractedText(r.getExtractedText() != null && r.getExtractedText().length() > 500
                                ? r.getExtractedText().substring(0, 500) + "..."
                                : r.getExtractedText())
                        .uploadedAt(r.getUploadedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private Resume getResumeOrThrow(Long resumeId, Long userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", resumeId));
        if (!resume.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Resume", resumeId);
        }
        return resume;
    }
}

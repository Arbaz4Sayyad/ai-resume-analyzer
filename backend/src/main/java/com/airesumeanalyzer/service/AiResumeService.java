package com.airesumeanalyzer.service;

import com.airesumeanalyzer.dto.ImproveResumeResponse;
import com.airesumeanalyzer.dto.InterviewQuestionsResponse;
import com.airesumeanalyzer.dto.MockInterviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiResumeService {

    private final AiServiceClient aiServiceClient;

    public ImproveResumeResponse improveResume(String resumeText) {
        Map<String, Object> result = aiServiceClient.improveResume(resumeText);
        String improvedResume = (String) result.get("improved_resume");
        @SuppressWarnings("unchecked")
        List<String> suggestions = (List<String>) result.getOrDefault("suggestions", List.of());
        return ImproveResumeResponse.builder()
                .improvedResume(improvedResume != null ? improvedResume : resumeText)
                .suggestions(suggestions)
                .build();
    }

    public InterviewQuestionsResponse generateInterviewQuestions(String resumeText) {
        Map<String, Object> result = aiServiceClient.generateInterviewQuestions(resumeText);
        @SuppressWarnings("unchecked")
        List<String> technical = (List<String>) result.getOrDefault("technical", List.of());
        @SuppressWarnings("unchecked")
        List<String> hr = (List<String>) result.getOrDefault("hr", List.of());
        @SuppressWarnings("unchecked")
        List<String> systemDesign = (List<String>) result.getOrDefault("system_design", List.of());
        return InterviewQuestionsResponse.builder()
                .technical(technical)
                .hr(hr)
                .systemDesign(systemDesign)
                .build();
    }

    public MockInterviewResponse mockInterview(String resumeText, String jobDescription) {
        Map<String, Object> result = aiServiceClient.mockInterview(resumeText,
                jobDescription != null ? jobDescription : "");
        Integer score = result.get("score") != null ? ((Number) result.get("score")).intValue() : 0;
        String feedback = (String) result.get("feedback");
        @SuppressWarnings("unchecked")
        List<String> improvementAreas = (List<String>) result.getOrDefault("improvement_areas", List.of());
        return MockInterviewResponse.builder()
                .score(score)
                .feedback(feedback != null ? feedback : "")
                .improvementAreas(improvementAreas)
                .build();
    }
}

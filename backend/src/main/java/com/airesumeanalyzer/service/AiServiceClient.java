package com.airesumeanalyzer.service;

import com.airesumeanalyzer.dto.AnalysisResponse;
import com.airesumeanalyzer.dto.CompareResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class AiServiceClient {

    private final RestClient restClient;

    public AiServiceClient(@Value("${app.ai-service.url}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public Map<String, List<String>> extractSkills(String resumeText) {
        return restClient.post()
                .uri("/extractSkills")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("resume_text", resumeText))
                .retrieve()
                .body(Map.class);
    }

    public Map<String, Object> getAtsScore(String resumeText, String jobDescription) {
        return restClient.post()
                .uri("/atsScore")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "resume_text", resumeText,
                        "job_description", jobDescription != null ? jobDescription : ""
                ))
                .retrieve()
                .body(Map.class);
    }

    public Map<String, List<String>> generateQuestions(String resumeText, String jobDescription) {
        return restClient.post()
                .uri("/generateQuestions")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "resume_text", resumeText,
                        "job_description", jobDescription != null ? jobDescription : ""
                ))
                .retrieve()
                .body(Map.class);
    }

    public CompareResponse compareJobDescription(String resumeText, String jobDescription) {
        Map<String, Object> response = restClient.post()
                .uri("/compareJobDescription")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "resume_text", resumeText,
                        "job_description", jobDescription
                ))
                .retrieve()
                .body(Map.class);

        return CompareResponse.builder()
                .matchedSkills((List<String>) response.get("matched_skills"))
                .missingSkills((List<String>) response.get("missing_skills"))
                .skillMatchPercentage(((Number) response.get("skill_match_percentage")).doubleValue())
                .atsScore(response.get("ats_score") != null ? ((Number) response.get("ats_score")).intValue() : null)
                .recommendations((List<String>) response.get("recommendations"))
                .build();
    }

    public Map<String, Object> getResumeSuggestions(String resumeText, String jobDescription) {
        return restClient.post()
                .uri("/resumeSuggestions")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "resume_text", resumeText,
                        "job_description", jobDescription != null ? jobDescription : ""
                ))
                .retrieve()
                .body(Map.class);
    }

    public String resumeChat(String resumeText, String jobDescription, String question) {
        Map<String, Object> response = restClient.post()
                .uri("/resumeChat")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "resume_text", resumeText,
                        "job_description", jobDescription != null ? jobDescription : "",
                        "question", question
                ))
                .retrieve()
                .body(Map.class);
        return (String) response.get("answer");
    }
}

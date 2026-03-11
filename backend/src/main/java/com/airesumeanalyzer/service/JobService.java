package com.airesumeanalyzer.service;

import com.airesumeanalyzer.dto.JobRecommendationDto;
import com.airesumeanalyzer.exception.ResourceNotFoundException;
import com.airesumeanalyzer.model.Job;
import com.airesumeanalyzer.model.Resume;
import com.airesumeanalyzer.repository.JobRepository;
import com.airesumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final AiServiceClient aiServiceClient;

    public List<JobRecommendationDto> getRecommendations(Long userId) {
        List<Resume> resumes = resumeRepository.findByUser_IdOrderByUploadedAtDesc(userId);
        if (resumes.isEmpty()) {
            return List.of();
        }
        String resumeText = resumes.get(0).getExtractedText();
        if (resumeText == null || resumeText.isBlank()) {
            return List.of();
        }

        Map<String, Object> aiRecommendations = aiServiceClient.getJobRecommendations(resumeText);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> recommended = (List<Map<String, Object>>) aiRecommendations.getOrDefault("recommended_jobs", List.of());

        if (!recommended.isEmpty()) {
            return recommended.stream()
                    .limit(10)
                    .map(j -> JobRecommendationDto.builder()
                            .id(((Number) j.getOrDefault("id", 0L)).longValue())
                            .title((String) j.get("title"))
                            .company((String) j.get("company"))
                            .description((String) j.get("description"))
                            .requiredSkills((List<String>) j.getOrDefault("required_skills", List.of()))
                            .matchScore(((Number) j.getOrDefault("match_score", 0)).intValue())
                            .build())
                    .collect(Collectors.toList());
        }

        List<Job> jobs = jobRepository.findTop20ByOrderByCreatedAtDesc();
        List<String> resumeSkills = extractSkillsFromAi(resumeText);

        return jobs.stream()
                .map(job -> {
                    int matchScore = calculateMatchScore(resumeSkills, job.getRequiredSkills());
                    return JobRecommendationDto.builder()
                            .id(job.getId())
                            .title(job.getTitle())
                            .company(job.getCompany())
                            .description(job.getDescription())
                            .requiredSkills(job.getRequiredSkills())
                            .matchScore(matchScore)
                            .build();
                })
                .filter(j -> j.getMatchScore() > 0)
                .sorted((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()))
                .limit(10)
                .collect(Collectors.toList());
    }

    private List<String> extractSkillsFromAi(String resumeText) {
        try {
            Map<String, List<String>> result = aiServiceClient.extractSkills(resumeText);

            List<String> skills = new java.util.ArrayList<>();

            for (String key : List.of("programming_languages", "frameworks", "tools", "databases", "technical_skills")) {
                List<String> values = result.get(key);
                if (values != null) {
                    values.forEach(s -> skills.add(s.toLowerCase()));
                }
            }

            return skills;

        } catch (Exception e) {
            return List.of();
        }
    }

    private int calculateMatchScore(List<String> resumeSkills, List<String> jobSkills) {
        if (jobSkills == null || jobSkills.isEmpty()) return 50;
        long matches = jobSkills.stream()
                .map(String::toLowerCase)
                .filter(js -> resumeSkills.stream().anyMatch(rs -> rs.contains(js) || js.contains(rs)))
                .count();
        return (int) (matches * 100 / jobSkills.size());
    }
}

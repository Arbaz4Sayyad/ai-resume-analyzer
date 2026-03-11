package com.airesumeanalyzer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class JobRecommendationDto {
    private Long id;
    private String title;
    private String company;
    private String description;
    private List<String> requiredSkills;
    private Integer matchScore;
}

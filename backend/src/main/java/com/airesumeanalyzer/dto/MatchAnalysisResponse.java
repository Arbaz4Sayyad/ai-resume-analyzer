package com.airesumeanalyzer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MatchAnalysisResponse {
    private Integer atsScore;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private List<String> experienceGaps;
    private List<String> suggestions;
}

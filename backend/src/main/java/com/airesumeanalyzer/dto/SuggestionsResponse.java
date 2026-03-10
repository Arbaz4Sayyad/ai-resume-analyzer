package com.airesumeanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestionsResponse {

    private Integer resumeScore;
    private List<String> missingKeywords;
    private List<String> improvementSuggestions;
    private String optimizedSummary;
}

package com.airesumeanalyzer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MatchAnalysisRequest {
    @NotNull
    private Long resumeId;
    private String jobDescription;
}

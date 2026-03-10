package com.airesumeanalyzer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SuggestionsRequest {

    @NotNull(message = "Resume ID is required")
    private Long resumeId;

    private String jobDescription;
}

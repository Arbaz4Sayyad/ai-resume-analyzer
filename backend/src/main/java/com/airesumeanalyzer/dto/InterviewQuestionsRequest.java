package com.airesumeanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InterviewQuestionsRequest {
    @NotBlank
    private String resumeText;
}

package com.airesumeanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MockInterviewRequest {
    @NotBlank
    private String resumeText;
    private String jobDescription;
}

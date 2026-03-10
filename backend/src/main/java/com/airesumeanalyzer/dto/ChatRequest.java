package com.airesumeanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatRequest {

    @NotNull(message = "Resume ID is required")
    private Long resumeId;

    private String jobDescription;

    @NotBlank(message = "Question is required")
    private String question;
}

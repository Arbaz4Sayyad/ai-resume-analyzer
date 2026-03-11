package com.airesumeanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ImproveResumeRequest {
    @NotBlank
    private String resumeText;
}

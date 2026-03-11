package com.airesumeanalyzer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ImproveResumeResponse {
    private String improvedResume;
    private List<String> suggestions;
}

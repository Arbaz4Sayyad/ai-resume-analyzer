package com.airesumeanalyzer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MockInterviewResponse {
    private Integer score;
    private String feedback;
    private List<String> improvementAreas;
}

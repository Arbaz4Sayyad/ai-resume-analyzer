package com.airesumeanalyzer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class InterviewQuestionsResponse {
    private List<String> technical;
    private List<String> hr;
    private List<String> systemDesign;
}

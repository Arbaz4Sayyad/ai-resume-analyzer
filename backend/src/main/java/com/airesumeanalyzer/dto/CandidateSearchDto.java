package com.airesumeanalyzer.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class CandidateSearchDto {
    private Long resumeId;
    private Long userId;
    private String email;
    private String fileName;
    private String extractedTextPreview;
    private Integer lastAtsScore;
    private List<String> skills;
    private Instant uploadedAt;
}

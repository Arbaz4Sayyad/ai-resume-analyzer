package com.airesumeanalyzer.controller;

import com.airesumeanalyzer.dto.CandidateSearchDto;
import com.airesumeanalyzer.service.RecruiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
@Tag(name = "Recruiter", description = "Recruiter dashboard - candidate search")
public class RecruiterController {

    private final RecruiterService recruiterService;

    @GetMapping("/candidates")
    @Operation(summary = "Search candidates by skills and ATS score")
    public ResponseEntity<List<CandidateSearchDto>> searchCandidates(
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) Integer minAtsScore
    ) {
        return ResponseEntity.ok(recruiterService.searchCandidates(skills, minAtsScore));
    }
}

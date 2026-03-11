package com.airesumeanalyzer.controller;

import com.airesumeanalyzer.dto.MatchAnalysisRequest;
import com.airesumeanalyzer.dto.MatchAnalysisResponse;
import com.airesumeanalyzer.security.CustomUserDetails;
import com.airesumeanalyzer.service.AnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
@Tag(name = "Analysis", description = "Resume vs Job Description analysis")
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping("/match")
    @Operation(summary = "Match resume against job description")
    public ResponseEntity<MatchAnalysisResponse> match(
            @Valid @RequestBody MatchAnalysisRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        Long userId = getUserId(user);

        return ResponseEntity.ok(
                analysisService.matchResumeToJob(
                        request.getResumeId(),
                        request.getJobDescription(),
                        userId
                )
        );
    }

    // 👇 THIS METHOD IS MISSING IN YOUR FILE
    private Long getUserId(UserDetails user) {
        if (user instanceof CustomUserDetails customUser) {
            return customUser.getUserId();
        }
        throw new IllegalStateException("Invalid user details type");
    }
}
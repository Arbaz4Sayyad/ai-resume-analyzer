package com.airesumeanalyzer.controller;

import com.airesumeanalyzer.dto.JobRecommendationDto;
import com.airesumeanalyzer.security.CustomUserDetails;
import com.airesumeanalyzer.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Job recommendations")
public class JobController {

    private final JobService jobService;

    @GetMapping("/recommendations")
    @Operation(summary = "Get job recommendations based on resume")
    public ResponseEntity<List<JobRecommendationDto>> recommendations(@AuthenticationPrincipal UserDetails user) {
        Long userId = getUserId(user);
        return ResponseEntity.ok(jobService.getRecommendations(userId));
    }

    private Long getUserId(UserDetails user) {
        if (user instanceof CustomUserDetails customUser) {
            return customUser.getUserId();
        }
        throw new IllegalStateException("Invalid user details type");
    }
}

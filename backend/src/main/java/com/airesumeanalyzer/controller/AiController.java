package com.airesumeanalyzer.controller;

import com.airesumeanalyzer.dto.*;
import com.airesumeanalyzer.service.AiResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI", description = "AI-powered resume and interview features")
public class AiController {

    private final AiResumeService aiResumeService;

    @PostMapping("/improve-resume")
    @Operation(summary = "Improve resume with AI")
    public ResponseEntity<ImproveResumeResponse> improveResume(@Valid @RequestBody ImproveResumeRequest request) {
        return ResponseEntity.ok(aiResumeService.improveResume(request.getResumeText()));
    }

    @PostMapping("/interview-questions")
    @Operation(summary = "Generate interview questions")
    public ResponseEntity<InterviewQuestionsResponse> interviewQuestions(@Valid @RequestBody InterviewQuestionsRequest request) {
        return ResponseEntity.ok(aiResumeService.generateInterviewQuestions(request.getResumeText()));
    }

    @PostMapping("/mock-interview")
    @Operation(summary = "Run mock interview evaluation")
    public ResponseEntity<MockInterviewResponse> mockInterview(@Valid @RequestBody MockInterviewRequest request) {
        return ResponseEntity.ok(aiResumeService.mockInterview(request.getResumeText(), request.getJobDescription()));
    }
}

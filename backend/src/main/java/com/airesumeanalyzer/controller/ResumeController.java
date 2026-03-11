package com.airesumeanalyzer.controller;

import com.airesumeanalyzer.dto.*;
import com.airesumeanalyzer.security.CustomUserDetails;
import com.airesumeanalyzer.service.ResumeService;
import lombok.RequiredArgsConstructor;
import com.airesumeanalyzer.dto.AnalyzeRequest;
import com.airesumeanalyzer.dto.CompareRequest;
import com.airesumeanalyzer.dto.SuggestionsRequest;
import com.airesumeanalyzer.dto.ChatRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/resume")
@Tag(name = "Resume", description = "Resume upload, analysis, and management")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    @Operation(summary = "Upload resume (PDF or DOCX)")
    public ResponseEntity<ResumeUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails user
    ) throws IOException {
        Long userId = getUserIdFromUser(user);
        return ResponseEntity.ok(resumeService.uploadResume(file, userId));
    }

    @GetMapping("/list")
    public ResponseEntity<List<ResumeUploadResponse>> list(@AuthenticationPrincipal UserDetails user) {
        Long userId = getUserIdFromUser(user);
        return ResponseEntity.ok(resumeService.listResumes(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeUploadResponse> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user
    ) {
        Long userId = getUserIdFromUser(user);
        return ResponseEntity.ok(resumeService.getResume(id, userId));
    }

    // @PostMapping("/analyze")
    // public ResponseEntity<AnalysisResponse> analyze(
    //         @RequestParam Long resumeId,
    //         @RequestParam(required = false) String jobDescription,
    //         @AuthenticationPrincipal UserDetails user
    // ) {
    //     Long userId = getUserIdFromUser(user);
    //     return ResponseEntity.ok(resumeService.analyze(resumeId, userId, jobDescription));
    // }

     @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponse> analyze(
            @RequestBody AnalyzeRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {

        Long userId = getUserIdFromUser(user);

        return ResponseEntity.ok(
                resumeService.analyze(
                        request.getResumeId(),
                        userId,
                        request.getJobDescription()
                )
        );
    }


    @PostMapping("/compare")
    public ResponseEntity<CompareResponse> compare(
            @RequestBody CompareRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        Long userId = getUserIdFromUser(user);
        return ResponseEntity.ok(resumeService.compare(
                request.getResumeId(),
                userId,
                request.getJobDescription()
        ));
    }

    @GetMapping("/questions")
    public ResponseEntity<Map<String, List<String>>> getQuestions(
            @RequestParam Long resumeId,
            @RequestParam(required = false) String jobDescription,
            @AuthenticationPrincipal UserDetails user
    ) {
        Long userId = getUserIdFromUser(user);
        return ResponseEntity.ok(resumeService.getQuestions(resumeId, userId, jobDescription));
    }

    @PostMapping("/suggestions")
    public ResponseEntity<SuggestionsResponse> getSuggestions(
            @RequestBody SuggestionsRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        Long userId = getUserIdFromUser(user);
        return ResponseEntity.ok(resumeService.getSuggestions(
                request.getResumeId(),
                userId,
                request.getJobDescription()
        ));
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        Long userId = getUserIdFromUser(user);
        return ResponseEntity.ok(resumeService.chat(
                request.getResumeId(),
                userId,
                request.getJobDescription(),
                request.getQuestion()
        ));
    }

    private Long getUserIdFromUser(UserDetails user) {
        if (user instanceof CustomUserDetails customUser) {
            return customUser.getUserId();
        }
        throw new IllegalStateException("Invalid user details type");
    }
}

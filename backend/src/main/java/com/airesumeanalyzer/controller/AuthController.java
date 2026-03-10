package com.airesumeanalyzer.controller;

import com.airesumeanalyzer.dto.AuthResponse;
import com.airesumeanalyzer.dto.LoginRequest;
import com.airesumeanalyzer.dto.ProfileResponse;
import com.airesumeanalyzer.dto.RegisterRequest;
import com.airesumeanalyzer.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> profile(@AuthenticationPrincipal UserDetails user) {
        String email = user.getUsername();
        return ResponseEntity.ok(authService.getProfile(email));
    }
}
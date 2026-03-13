package com.airesumeanalyzer.controller;

import com.airesumeanalyzer.dto.AuthResponse;
import com.airesumeanalyzer.dto.ForgotPasswordRequest;
import com.airesumeanalyzer.dto.LoginRequest;
import com.airesumeanalyzer.dto.ProfileResponse;
import com.airesumeanalyzer.dto.RegisterRequest;
import com.airesumeanalyzer.dto.ResetPasswordRequest;
import com.airesumeanalyzer.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

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

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    /**
     * Entry point for OAuth login flows from the SPA.
     * Redirects to Spring Security's OAuth2 authorization endpoint.
     */
    @GetMapping("/oauth/{provider}")
    public void oauthRedirect(@PathVariable String provider, HttpServletResponse response) throws IOException {
        // Delegate to Spring Security's /oauth2/authorization/{provider}
        String target = "/oauth2/authorization/" + provider.toLowerCase();
        response.sendRedirect(target);
    }
}
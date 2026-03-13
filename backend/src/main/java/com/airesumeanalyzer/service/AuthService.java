package com.airesumeanalyzer.service;

import com.airesumeanalyzer.dto.AuthResponse;
import com.airesumeanalyzer.dto.ForgotPasswordRequest;
import com.airesumeanalyzer.dto.LoginRequest;
import com.airesumeanalyzer.dto.ProfileResponse;
import com.airesumeanalyzer.dto.RegisterRequest;
import com.airesumeanalyzer.dto.ResetPasswordRequest;
import com.airesumeanalyzer.model.PasswordResetToken;
import com.airesumeanalyzer.model.User;
import com.airesumeanalyzer.model.UserRole;
import com.airesumeanalyzer.repository.PasswordResetTokenRepository;
import com.airesumeanalyzer.repository.UserRepository;
import com.airesumeanalyzer.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .provider("LOCAL")
                .build();
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }

    public ProfileResponse getProfile(String email) {
        return userRepository.findByEmail(email)
                .map(user -> ProfileResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .createdAt(user.getCreatedAt())
                        .build())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public Map<String, Object> forgotPassword(ForgotPasswordRequest request) {
        // Always return a generic success message to avoid leaking which emails exist
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            Instant expiresAt = Instant.now().plus(Duration.ofHours(1));

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .token(token)
                    .expiresAt(expiresAt)
                    .used(false)
                    .build();

            passwordResetTokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password?token=" + token;

            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(user.getEmail());
                message.setSubject("Reset your AI Resume Analyzer password");
                message.setText(
                        "You requested a password reset for your AI Resume Analyzer account.\n\n"
                                + "Click the link below to set a new password (valid for 1 hour):\n"
                                + resetLink + "\n\n"
                                + "If you did not request this, you can safely ignore this email."
                );
                mailSender.send(message);
            } catch (Exception ignored) {
                // If email configuration is missing, we do not want to fail the request.
            }
        });

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "If this email exists, a reset link has been sent.");
        return response;
    }

    public Map<String, Object> resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Reset link is invalid or has expired"));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Reset link is invalid or has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password has been reset successfully.");
        return response;
    }
}

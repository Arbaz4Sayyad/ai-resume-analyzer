package com.airesumeanalyzer.service;

import com.airesumeanalyzer.dto.AuthResponse;
import com.airesumeanalyzer.dto.LoginRequest;
import com.airesumeanalyzer.dto.ProfileResponse;
import com.airesumeanalyzer.dto.RegisterRequest;
import com.airesumeanalyzer.model.User;
import com.airesumeanalyzer.repository.UserRepository;
import com.airesumeanalyzer.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .userId(user.getId())
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
                .build();
    }

    public ProfileResponse getProfile(String email) {
        return userRepository.findByEmail(email)
                .map(user -> ProfileResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .createdAt(user.getCreatedAt())
                        .build())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}

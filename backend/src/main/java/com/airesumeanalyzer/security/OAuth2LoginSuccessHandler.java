package com.airesumeanalyzer.security;

import com.airesumeanalyzer.model.User;
import com.airesumeanalyzer.model.UserRole;
import com.airesumeanalyzer.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
            response.sendRedirect(frontendUrl + "/login?error=oauth");
            return;
        }

        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String registrationId = oauthToken.getAuthorizedClientRegistrationId();

        // String email = oAuth2User.getAttribute("email");
        // if (email == null) {
        //     response.sendRedirect(frontendUrl + "/login?error=oauth_email");
        //     return;
        // }

        // String name = Optional.ofNullable(oAuth2User.getAttribute("name")).orElse("");
        // String provider = registrationId.toUpperCase();

        String email = Optional.ofNullable(oAuth2User.getAttribute("email"))
                    .map(Object::toString)
                    .orElse(null);

        if (email == null) {
            response.sendRedirect(frontendUrl + "/login?error=oauth_email");
            return;
        }

        String name = Optional.ofNullable(oAuth2User.getAttribute("name"))
                    .map(Object::toString)
                    .orElse("");
        String provider = registrationId.toUpperCase();

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            // OAuth users authenticate via provider, so we don't require a local password
            u.setPassword("");
            u.setRole(UserRole.USER);
            u.setName(name);
            u.setProvider(provider);
            return userRepository.save(u);
        });

        user.setName(name);
        user.setProvider(provider);
        userRepository.save(user);

        String token = jwtService.generateToken(email);

        String targetUrl = String.format(
                "%s/login?oauthToken=%s&email=%s&userId=%d&role=%s",
                frontendUrl,
                URLEncoder.encode(token, StandardCharsets.UTF_8),
                URLEncoder.encode(email, StandardCharsets.UTF_8),
                user.getId(),
                URLEncoder.encode(user.getRole().name(), StandardCharsets.UTF_8)
        );

        response.sendRedirect(targetUrl);
    }
}


package com.airesumeanalyzer.security;

import com.airesumeanalyzer.model.UserRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class CustomUserDetails extends User {

    private final Long userId;
    private final UserRole role;

    public CustomUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities,
                            Long userId, UserRole role) {
        super(username, password, authorities);
        this.userId = userId;
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public UserRole getRole() {
        return role;
    }
}

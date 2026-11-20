package com.ours.backend.security;

public class AuthResponse {

    private Long userId;
    private String email;
    private boolean mustChangePassword;

    public AuthResponse(
            Long userId,
            String email,
            boolean mustChangePassword
    ) {
        this.userId = userId;
        this.email = email;
        this.mustChangePassword = mustChangePassword;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public boolean isMustChangePassword() {
        return mustChangePassword;
    }
}
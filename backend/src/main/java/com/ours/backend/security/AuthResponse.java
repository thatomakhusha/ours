package com.ours.backend.security;

public class AuthResponse {

    private String token;
    private String tokenType;
    private Long userId;
    private String email;

    private boolean mustChangePassword;

    public AuthResponse(
            String token,
            String tokenType,
            Long userId,
            String email,
            boolean mustChangePassword
    ) {
        this.token = token;
        this.tokenType = tokenType;
        this.userId = userId;
        this.email = email;
        this.mustChangePassword = mustChangePassword;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
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

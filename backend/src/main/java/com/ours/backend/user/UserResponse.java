package com.ours.backend.user;

import java.time.OffsetDateTime;

public class UserResponse {

    private Long userId;
    private String firstName;
    private String displayName;
    private String email;
    private OffsetDateTime createdAt;

    public UserResponse(
            Long userId,
            String firstName,
            String displayName,
            String email,
            OffsetDateTime createdAt
    ) {
        this.userId = userId;
        this.firstName = firstName;
        this.displayName = displayName;
        this.email = email;
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getEmail() {
        return email;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}

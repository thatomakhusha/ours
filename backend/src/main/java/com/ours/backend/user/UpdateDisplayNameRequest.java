package com.ours.backend.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateDisplayNameRequest {

    @NotBlank(message = "Display name cannot be empty.")
    @Size(max = 50, message = "Display name cannot exceed 50 characters.")
    private String displayName;

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}

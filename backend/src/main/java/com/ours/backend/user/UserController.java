package com.ours.backend.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ours.backend.common.NotFoundException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        return userService.findByEmail(email)
                .map(user -> new UserResponse(
                        user.getUserId(),
                        user.getFirstName(),
                        user.getDisplayName(),
                        user.getEmail(),
                        user.getCreatedAt()
                ))
                .orElseThrow(() -> new NotFoundException("User account not found."));
    }

    @PatchMapping("/me/display-name")
    public UserResponse updateDisplayName(
            Authentication authentication,
            @Valid @RequestBody UpdateDisplayNameRequest request
    ) {
        User currentUser = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new NotFoundException("User account not found."));

        User updatedUser = userService.updateDisplayName(
                currentUser.getUserId(),
                request.getDisplayName()
        );

        return new UserResponse(
                updatedUser.getUserId(),
                updatedUser.getFirstName(),
                updatedUser.getDisplayName(),
                updatedUser.getEmail(),
                updatedUser.getCreatedAt()
        );
    }
}

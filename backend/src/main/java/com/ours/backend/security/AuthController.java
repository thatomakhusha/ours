package com.ours.backend.security;

import com.ours.backend.user.User;
import com.ours.backend.user.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.web.csrf.CsrfToken;

@RestController
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthCookieService authCookieService;

    public AuthController(
            UserService userService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthCookieService authCookieService
    ) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authCookieService = authCookieService;
    }

    @GetMapping("/api/auth/csrf")
    public CsrfToken csrf(CsrfToken csrfToken) {
        return csrfToken;
    }

    @PostMapping("/api/auth/logout")
    public void logout(HttpServletResponse response) {
        authCookieService.clearAuthCookie(response);
    }

    @PostMapping("/api/auth/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password."
                ));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password."
            );
        }

        String token = jwtService.generateToken(user);

        authCookieService.addAuthCookie(response, token);

        return new AuthResponse(
                user.getUserId(),
                user.getEmail(),
                user.isMustChangePassword()
        );
    }

    @PostMapping("/api/auth/change-password")
    public AuthResponse changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication,
            HttpServletResponse response
    ) {
        User currentUser = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User account not found."
                ));

        User updatedUser = userService.changePassword(
                currentUser.getUserId(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        String token = jwtService.generateToken(updatedUser);

        authCookieService.addAuthCookie(response, token);

        return new AuthResponse(
                updatedUser.getUserId(),
                updatedUser.getEmail(),
                updatedUser.isMustChangePassword()
        );
    }
}
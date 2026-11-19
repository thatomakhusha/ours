package com.ours.backend.user;

import org.springframework.stereotype.Service;
import java.util.Locale;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.regex.Pattern;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;

import com.ours.backend.common.ConflictException;

import com.ours.backend.common.NotFoundException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty.");
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

        if (normalizedEmail.length() > 255) {
            throw new IllegalArgumentException("Email cannot exceed 255 characters.");
        }

        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
            throw new IllegalArgumentException("Please provide a valid email address.");
        }

        return normalizedEmail;
    }

    private String validateName(String name, String fieldName) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(fieldName + " cannot be empty.");
        }

        String trimmedName = name.trim();

        if (trimmedName.length() > 50) {
            throw new IllegalArgumentException(fieldName + " cannot exceed 50 characters.");
        }

        return trimmedName;
    }

    public boolean emailExists(String email) {
        String normalizedEmail = normalizeEmail(email);
        return userRepository.existsByEmail(normalizedEmail);
    }

    public Optional<User> findByEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        return userRepository.findByEmailIgnoreCase(normalizedEmail);
    }

    private void ensureAccountLimitNotReached() {
        long userCount = userRepository.count();

        if (userCount >= 2) {
            throw new ConflictException("Ours already has its maximum of two user accounts.");
        }
    }

    private void ensureEmailNotRegistered(String email) {
        if (emailExists(email)) {
            throw new ConflictException("A user with this email address already exists.");
        }
    }

    private String hashPassword(String rawPassword) {
        validatePassword(rawPassword);

        return passwordEncoder.encode(rawPassword);
    }

    private void validatePassword(String rawPassword) {
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty.");
        }

        if (rawPassword.length() < 8) {
            throw new IllegalArgumentException("Password must contain at least 8 characters.");
        }

        if (rawPassword.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("Password cannot exceed 72 UTF-8 bytes.");
        }

        if (!rawPassword.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter.");
        }

        if (!rawPassword.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("Password must contain at least one lowercase letter.");
        }

        if (!rawPassword.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("Password must contain at least one number.");
        }

        if (!rawPassword.matches(".*[^A-Za-z0-9].*")) {
            throw new IllegalArgumentException("Password must contain at least one special character.");
        }
    }

    public User createAccount(
            String firstName,
            String displayName,
            String email,
            String temporaryPassword
    ) {
        String validatedFirstName = validateName(firstName, "First name");
        String validatedDisplayName = validateName(displayName, "Display name");

        ensureAccountLimitNotReached();
        ensureEmailNotRegistered(email);

        String normalizedEmail = normalizeEmail(email);
        String passwordHash = hashPassword(temporaryPassword);

        User user = new User();
        user.setFirstName(validatedFirstName);
        user.setDisplayName(validatedDisplayName);
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordHash);
        user.setMustChangePassword(true);

        return userRepository.save(user);
    }

    public User changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User account not found."));

        if (currentPassword == null || currentPassword.isBlank()) {
            throw new IllegalArgumentException("Current password cannot be empty.");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }

        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("New password must be different from the current password.");
        }

        String newPasswordHash = hashPassword(newPassword);

        user.setPasswordHash(newPasswordHash);
        user.setMustChangePassword(false);
        user.setPasswordChangedAt(OffsetDateTime.now());

        return userRepository.save(user);
    }

    public User updateDisplayName(Long userId, String newDisplayName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User account not found."));

        String validatedDisplayName = validateName(newDisplayName, "Display name");

        user.setDisplayName(validatedDisplayName);

        return userRepository.save(user);
    }
}

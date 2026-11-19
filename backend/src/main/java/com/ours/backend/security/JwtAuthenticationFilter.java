package com.ours.backend.security;

import org.springframework.web.filter.OncePerRequestFilter;
import com.ours.backend.user.User;
import com.ours.backend.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import java.util.List;

import io.jsonwebtoken.JwtException;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;


    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);

        String email = null;
        User user = null;
        boolean validToken = false;

        try {
            email = jwtService.extractEmail(token);

            user = userRepository.findByEmailIgnoreCase(email)
                    .orElse(null);

            if (user != null) {
                validToken = jwtService.isTokenValid(token, user);
            }

        } catch (JwtException | IllegalArgumentException exception) {
            validToken = false;
        }

        if (!validToken) {
            filterChain.doFilter(request, response);
            return;
        }

        if (user.isMustChangePassword()
                && (!request.getServletPath().equals("/api/auth/change-password")
                || !request.getMethod().equals("POST"))) {

            response.sendError(
                    HttpServletResponse.SC_FORBIDDEN,
                    "You must change your password before accessing this resource."
            );

            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() == null) {

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);

    }
}

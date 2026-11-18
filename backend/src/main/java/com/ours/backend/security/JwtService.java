
package com.ours.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

import com.ours.backend.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long jwtExpiration;

    public JwtService(
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration}") long jwtExpiration
    ) {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.jwtExpiration = jwtExpiration;
    }

    public String generateToken(String email, boolean mustChangePassword) {
        long issuedAtMillis = System.currentTimeMillis();

        return Jwts.builder()
                .subject(email)
                .claim("mustChangePassword", mustChangePassword)
                .claim("issuedAtMillis", issuedAtMillis)
                .issuedAt(new Date(issuedAtMillis))
                .expiration(new Date(issuedAtMillis + jwtExpiration))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean extractMustChangePassword(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("mustChangePassword", Boolean.class);
    }

    public Date extractIssuedAt(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getIssuedAt();
    }

    public long extractIssuedAtMillis(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("issuedAtMillis", Long.class);
    }

    public boolean isTokenValid(String token, User user) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.getSubject();

            Long issuedAtMillis = claims.get("issuedAtMillis", Long.class);

            if (email == null || issuedAtMillis == null) {
                return false;
            }

            if (!email.equals(user.getEmail())) {
                return false;
            }

            if (user.getPasswordChangedAt() != null
                    && issuedAtMillis <= user.getPasswordChangedAt()
                    .toInstant().toEpochMilli()) {
                return false;
            }

            return true;

        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }
}

package com.galaxy_md.security;

import com.galaxy_md.entity.User;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET = "test-secret-key-for-jwt-service-unit-tests-1234567890";

    private final JwtService jwtService = new JwtService(SECRET, 60_000, true);

    private User aUser() {
        return User.builder()
                .id(42L)
                .username("alice")
                .email("alice@example.com")
                .passwordHash("hashed")
                .build();
    }

    @Test
    void generatesATokenThatContainsTheUserId() {
        String token = jwtService.generateToken(aUser());

        assertThat(jwtService.extractUserId(token)).isEqualTo(42L);
    }

    @Test
    void generatesATokenThatContainsTheEmail() {
        String token = jwtService.generateToken(aUser());

        assertThat(jwtService.extractEmail(token)).isEqualTo("alice@example.com");
    }

    @Test
    void rejectsATokenSignedWithADifferentSecret() {
        JwtService otherJwtService = new JwtService("another-secret-key-completely-different-0987654321", 60_000, true);
        String token = otherJwtService.generateToken(aUser());

        assertThatThrownBy(() -> jwtService.extractUserId(token))
                .isInstanceOf(SignatureException.class);
    }

    @Test
    void rejectsAnExpiredToken() {
        JwtService expiredJwtService = new JwtService(SECRET, -1_000, true);
        String token = expiredJwtService.generateToken(aUser());

        assertThatThrownBy(() -> jwtService.extractUserId(token))
                .isInstanceOf(ExpiredJwtException.class);
    }
}

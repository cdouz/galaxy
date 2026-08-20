package com.galaxy_md.security;

import com.galaxy_md.entity.User;
import com.galaxy_md.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    private static final String SECRET = "test-secret-key-for-jwt-filter-unit-tests-1234567890";

    private final JwtService jwtService = new JwtService(SECRET, 60_000, true);

    @Mock
    private UserRepository userRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        filter = new JwtAuthenticationFilter(jwtService, userRepository);
    }

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    private User aUser() {
        return User.builder()
                .id(42L)
                .username("alice")
                .email("alice@example.com")
                .passwordHash("hashed")
                .build();
    }

    @Test
    void authenticatesWhenCookieHoldsAValidToken() throws Exception {
        String token = jwtService.generateToken(aUser());
        when(request.getCookies()).thenReturn(new Cookie[]{new Cookie(JwtService.ACCESS_TOKEN_COOKIE, token)});
        when(userRepository.findById(42L)).thenReturn(Optional.of(aUser()));

        filter.doFilter(request, response, filterChain);

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(((UserPrincipal) authentication.getPrincipal()).getId()).isEqualTo(42L);
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doesNotAuthenticateWhenNoCookieIsPresent() throws Exception {
        when(request.getCookies()).thenReturn(null);

        filter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doesNotAuthenticateWhenTokenIsInvalid() throws Exception {
        when(request.getCookies()).thenReturn(new Cookie[]{new Cookie(JwtService.ACCESS_TOKEN_COOKIE, "not-a-jwt")});

        filter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doesNotAuthenticateWhenUserNoLongerExists() throws Exception {
        String token = jwtService.generateToken(aUser());
        when(request.getCookies()).thenReturn(new Cookie[]{new Cookie(JwtService.ACCESS_TOKEN_COOKIE, token)});
        when(userRepository.findById(42L)).thenReturn(Optional.empty());

        filter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doesNotAuthenticateWhenTokenCookieIsBlank() throws Exception {
        when(request.getCookies()).thenReturn(new Cookie[]{new Cookie(JwtService.ACCESS_TOKEN_COOKIE, "")});

        filter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doesNotAuthenticateWhenSubjectIsNotAUserId() throws Exception {
        String token = Jwts.builder()
                .subject("not-a-number")
                .expiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .compact();
        when(request.getCookies()).thenReturn(new Cookie[]{new Cookie(JwtService.ACCESS_TOKEN_COOKIE, token)});

        filter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }
}

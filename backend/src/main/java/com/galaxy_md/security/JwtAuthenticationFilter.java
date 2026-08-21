package com.galaxy_md.security;

import com.galaxy_md.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        extractTokenFromCookies(request)
                .flatMap(this::authenticate)
                .ifPresent(userPrincipal -> {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userPrincipal, null, userPrincipal.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                });

        filterChain.doFilter(request, response);
    }

    private Optional<String> extractTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }
        return Arrays.stream(cookies)
                .filter(cookie -> JwtService.ACCESS_TOKEN_COOKIE.equals(cookie.getName()))
                .map(Cookie::getValue)
                .filter(value -> value != null && !value.isBlank())
                .findFirst();
    }

    private Optional<UserPrincipal> authenticate(String token) {
        try {
            Long userId = jwtService.extractUserId(token);
            Long tokenVersion = jwtService.extractTokenVersion(token);
            return userRepository.findById(userId)
                    // Logout bumps the stored version, which strands every token issued before it.
                    .filter(user -> user.getTokenVersion().equals(tokenVersion))
                    .map(UserPrincipal::new);
        } catch (JwtException | IllegalArgumentException e) {
            // JwtException covers expired, malformed and badly signed tokens. JJWT throws a
            // plain IllegalArgumentException for a blank token, and Long.valueOf throws
            // NumberFormatException on a non-numeric subject; an unusable cookie must leave
            // the request anonymous, never bubble up as a 500.
            return Optional.empty();
        }
    }
}

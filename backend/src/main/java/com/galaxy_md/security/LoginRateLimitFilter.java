package com.galaxy_md.security;

import com.galaxy_md.exception.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Duration;

/**
 * Throttles repeated failed logins from the same client. It sits in front of the
 * controller so a locked-out client never reaches password hashing.
 *
 * The client is identified by its socket address. Behind a reverse proxy every
 * request would appear to come from the proxy, so a deployment there must also
 * enable Spring's ForwardedHeaderFilter (server.forward-headers-strategy).
 */
@Component
@RequiredArgsConstructor
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private static final String LOGIN_PATH = "/api/auth/login";

    private final LoginAttemptService loginAttemptService;
    private final ObjectMapper objectMapper;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !HttpMethod.POST.matches(request.getMethod()) || !LOGIN_PATH.equals(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientKey = request.getRemoteAddr();
        Duration retryAfter = loginAttemptService.retryAfter(clientKey);
        if (!retryAfter.isZero()) {
            writeTooManyRequests(response, retryAfter);
            return;
        }

        filterChain.doFilter(request, response);

        if (response.getStatus() == HttpStatus.UNAUTHORIZED.value()) {
            loginAttemptService.recordFailure(clientKey);
        } else if (response.getStatus() < HttpStatus.BAD_REQUEST.value()) {
            loginAttemptService.recordSuccess(clientKey);
        }
    }

    private void writeTooManyRequests(HttpServletResponse response, Duration retryAfter) throws IOException {
        long retryAfterSeconds = Math.max(1, retryAfter.toSeconds());
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(retryAfterSeconds));
        objectMapper.writeValue(response.getWriter(), new ErrorResponse(
                HttpStatus.TOO_MANY_REQUESTS.value(),
                "Too many failed login attempts. Try again in " + retryAfterSeconds + " seconds."));
    }
}

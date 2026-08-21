package com.galaxy_md.security;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import tools.jackson.databind.ObjectMapper;

import java.time.Clock;
import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class LoginRateLimitFilterTest {

    private static final Duration LOCKOUT = Duration.ofMinutes(15);
    private static final String CLIENT = "203.0.113.7";

    private final LoginAttemptService attemptService =
            new LoginAttemptService(3, LOCKOUT, Clock.systemUTC());
    private final LoginRateLimitFilter filter = new LoginRateLimitFilter(attemptService, new ObjectMapper());

    private MockHttpServletRequest loginRequest() {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
        request.setRemoteAddr(CLIENT);
        return request;
    }

    @Test
    void countsAFailedLoginAndLetsItThrough() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = (req, res) -> ((MockHttpServletResponse) res).setStatus(401);

        filter.doFilter(loginRequest(), response, chain);

        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(attemptService.retryAfter(CLIENT)).isZero();
    }

    @Test
    void rejectsWithRetryAfterOnceTheClientIsLockedOut() throws Exception {
        FilterChain failing = (req, res) -> ((MockHttpServletResponse) res).setStatus(401);
        for (int i = 0; i < 3; i++) {
            filter.doFilter(loginRequest(), new MockHttpServletResponse(), failing);
        }

        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);
        filter.doFilter(loginRequest(), response, chain);

        assertThat(response.getStatus()).isEqualTo(429);
        assertThat(response.getHeader(HttpHeaders.RETRY_AFTER)).isNotNull();
        assertThat(response.getContentAsString()).contains("Too many failed login attempts");
        verify(chain, never()).doFilter(loginRequest(), response);
    }

    @Test
    void clearsTheCounterOnASuccessfulLogin() throws Exception {
        FilterChain failing = (req, res) -> ((MockHttpServletResponse) res).setStatus(401);
        for (int i = 0; i < 2; i++) {
            filter.doFilter(loginRequest(), new MockHttpServletResponse(), failing);
        }

        filter.doFilter(loginRequest(), new MockHttpServletResponse(),
                (req, res) -> ((MockHttpServletResponse) res).setStatus(200));
        for (int i = 0; i < 2; i++) {
            filter.doFilter(loginRequest(), new MockHttpServletResponse(), failing);
        }

        assertThat(attemptService.retryAfter(CLIENT)).isZero();
    }

    @Test
    void ignoresEverythingButThePostLoginEndpoint() throws Exception {
        MockHttpServletRequest notes = new MockHttpServletRequest("GET", "/api/notes");
        notes.setRemoteAddr(CLIENT);
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(notes, response, chain);

        verify(chain).doFilter(notes, response);
        assertThat(response.getStatus()).isEqualTo(200);
    }
}

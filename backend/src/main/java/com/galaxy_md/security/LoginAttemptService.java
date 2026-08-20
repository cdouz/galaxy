package com.galaxy_md.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Counts recent failed logins per client so brute-force attempts stop before they
 * reach BCrypt, which costs ~200 ms of CPU per call at strength 12 and is
 * therefore also a denial-of-service lever.
 *
 * State is per-instance and in-memory: it is a speed bump, not a distributed
 * quota. Running several instances behind a load balancer would need a shared
 * store to be effective.
 */
@Service
public class LoginAttemptService {

    /** Guards against an attacker growing the map by varying their source. */
    private static final int MAX_TRACKED_CLIENTS = 10_000;

    private final ConcurrentHashMap<String, Attempts> attemptsByClient = new ConcurrentHashMap<>();
    private final int maxAttempts;
    private final Duration lockoutDuration;
    private final Clock clock;

    @Autowired
    public LoginAttemptService(
            @Value("${app.security.login.max-attempts}") int maxAttempts,
            @Value("${app.security.login.lockout-duration}") Duration lockoutDuration
    ) {
        this(maxAttempts, lockoutDuration, Clock.systemUTC());
    }

    /** Visible for tests, which drive time through their own clock. */
    LoginAttemptService(int maxAttempts, Duration lockoutDuration, Clock clock) {
        this.maxAttempts = maxAttempts;
        this.lockoutDuration = lockoutDuration;
        this.clock = clock;
    }

    /**
     * @return how long the client must wait, or {@link Duration#ZERO} if it may try now.
     */
    public Duration retryAfter(String clientKey) {
        Attempts attempts = attemptsByClient.get(clientKey);
        if (attempts == null) {
            return Duration.ZERO;
        }

        Instant now = clock.instant();
        if (attempts.failures < maxAttempts || !attempts.expiresAt.isAfter(now)) {
            return Duration.ZERO;
        }
        return Duration.between(now, attempts.expiresAt);
    }

    public void recordFailure(String clientKey) {
        Instant now = clock.instant();
        pruneIfCrowded(now);

        attemptsByClient.compute(clientKey, (key, current) -> {
            if (current == null || !current.expiresAt.isAfter(now)) {
                return new Attempts(1, now.plus(lockoutDuration));
            }
            return new Attempts(current.failures + 1, current.expiresAt);
        });
    }

    public void recordSuccess(String clientKey) {
        attemptsByClient.remove(clientKey);
    }

    private void pruneIfCrowded(Instant now) {
        if (attemptsByClient.size() >= MAX_TRACKED_CLIENTS) {
            attemptsByClient.values().removeIf(attempts -> !attempts.expiresAt.isAfter(now));
        }
    }

    private record Attempts(int failures, Instant expiresAt) {
    }
}

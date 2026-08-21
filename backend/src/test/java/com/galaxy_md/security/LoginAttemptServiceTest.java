package com.galaxy_md.security;

import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

class LoginAttemptServiceTest {

    private static final String CLIENT = "203.0.113.7";
    private static final Duration LOCKOUT = Duration.ofMinutes(15);

    private final MutableClock clock = new MutableClock(Instant.parse("2026-01-01T10:00:00Z"));
    private final LoginAttemptService service = new LoginAttemptService(3, LOCKOUT, clock);

    @Test
    void allowsAClientThatHasNeverFailed() {
        assertThat(service.retryAfter(CLIENT)).isZero();
    }

    @Test
    void allowsRetriesUpToTheLimit() {
        service.recordFailure(CLIENT);
        service.recordFailure(CLIENT);

        assertThat(service.retryAfter(CLIENT)).isZero();
    }

    @Test
    void locksOutOnceTheLimitIsReached() {
        for (int i = 0; i < 3; i++) {
            service.recordFailure(CLIENT);
        }

        assertThat(service.retryAfter(CLIENT)).isEqualTo(LOCKOUT);
    }

    @Test
    void doesNotLockOutOtherClients() {
        for (int i = 0; i < 3; i++) {
            service.recordFailure(CLIENT);
        }

        assertThat(service.retryAfter("198.51.100.4")).isZero();
    }

    @Test
    void releasesTheClientOnceTheWindowHasPassed() {
        for (int i = 0; i < 3; i++) {
            service.recordFailure(CLIENT);
        }

        clock.advance(LOCKOUT.plusSeconds(1));

        assertThat(service.retryAfter(CLIENT)).isZero();
    }

    @Test
    void startsAFreshWindowAfterTheOldOneExpires() {
        for (int i = 0; i < 3; i++) {
            service.recordFailure(CLIENT);
        }
        clock.advance(LOCKOUT.plusSeconds(1));

        service.recordFailure(CLIENT);

        assertThat(service.retryAfter(CLIENT)).isZero();
    }

    @Test
    void forgetsFailuresAfterASuccessfulLogin() {
        service.recordFailure(CLIENT);
        service.recordFailure(CLIENT);

        service.recordSuccess(CLIENT);
        service.recordFailure(CLIENT);

        assertThat(service.retryAfter(CLIENT)).isZero();
    }

    private static final class MutableClock extends Clock {

        private Instant now;

        private MutableClock(Instant now) {
            this.now = now;
        }

        void advance(Duration amount) {
            now = now.plus(amount);
        }

        @Override
        public Instant instant() {
            return now;
        }

        @Override
        public ZoneOffset getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(java.time.ZoneId zone) {
            return this;
        }
    }
}

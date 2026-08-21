package com.galaxy_md.service;

import com.galaxy_md.dto.LoginRequest;
import com.galaxy_md.dto.RegisterRequest;
import com.galaxy_md.entity.User;
import com.galaxy_md.exception.EmailAlreadyUsedException;
import com.galaxy_md.exception.InvalidCredentialsException;
import com.galaxy_md.exception.UsernameAlreadyUsedException;
import com.galaxy_md.repository.UserRepository;
import com.galaxy_md.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(userRepository, passwordEncoder, authenticationManager);
    }

    private RegisterRequest aRegisterRequest() {
        return RegisterRequest.builder()
                .username("alice")
                .email("alice@example.com")
                .password("password123")
                .build();
    }

    @Test
    void registersANewUserWithAHashedPassword() {
        RegisterRequest request = aRegisterRequest();
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User saved = authService.register(request);

        assertThat(saved.getUsername()).isEqualTo("alice");
        assertThat(saved.getEmail()).isEqualTo("alice@example.com");
        assertThat(saved.getPasswordHash()).isEqualTo("hashed-password");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getPasswordHash()).isEqualTo("hashed-password");
    }

    @Test
    void rejectsRegistrationWhenUsernameIsAlreadyTaken() {
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(aRegisterRequest()))
                .isInstanceOf(UsernameAlreadyUsedException.class);
    }

    @Test
    void rejectsRegistrationWhenEmailIsAlreadyTaken() {
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(aRegisterRequest()))
                .isInstanceOf(EmailAlreadyUsedException.class);
    }

    @Test
    void logsInAndReturnsTheAuthenticatedUser() {
        User user = User.builder().id(42L).username("alice").email("alice@example.com").passwordHash("hashed").build();
        var authenticated = new TestingAuthenticationToken(new UserPrincipal(user), null);
        authenticated.setAuthenticated(true);
        when(authenticationManager.authenticate(any())).thenReturn(authenticated);

        User result = authService.login(LoginRequest.builder().email("alice@example.com").password("password123").build());

        assertThat(result.getId()).isEqualTo(42L);
    }

    @Test
    void rejectsLoginWithInvalidCredentials() {
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("bad credentials"));

        assertThatThrownBy(() -> authService.login(LoginRequest.builder().email("alice@example.com").password("wrong").build()))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void logoutRevokesTheTokensIssuedSoFar() {
        authService.logout(42L);

        verify(userRepository).incrementTokenVersion(42L);
    }
}

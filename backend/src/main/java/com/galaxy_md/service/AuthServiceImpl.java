package com.galaxy_md.service;

import com.galaxy_md.dto.LoginRequest;
import com.galaxy_md.dto.RegisterRequest;
import com.galaxy_md.entity.User;
import com.galaxy_md.exception.EmailAlreadyUsedException;
import com.galaxy_md.exception.InvalidCredentialsException;
import com.galaxy_md.exception.InvalidPasswordException;
import com.galaxy_md.exception.UserNotFoundException;
import com.galaxy_md.exception.UsernameAlreadyUsedException;
import com.galaxy_md.repository.UserRepository;
import com.galaxy_md.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyUsedException(request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyUsedException(request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException();
        }
        return ((UserPrincipal) authentication.getPrincipal()).getUser();
    }

    @Override
    public User updateUsername(Long userId, String newUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (!newUsername.equals(user.getUsername()) && userRepository.existsByUsername(newUsername)) {
            throw new UsernameAlreadyUsedException(newUsername);
        }

        user.setUsername(newUsername);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteAccount(Long userId, String rawPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new InvalidPasswordException();
        }

        userRepository.delete(user);
    }
}

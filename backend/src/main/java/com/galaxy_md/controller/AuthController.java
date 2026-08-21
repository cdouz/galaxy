package com.galaxy_md.controller;

import com.galaxy_md.dto.AuthResponse;
import com.galaxy_md.dto.DeleteAccountRequest;
import com.galaxy_md.dto.LoginRequest;
import com.galaxy_md.dto.RegisterRequest;
import com.galaxy_md.dto.UpdateUsernameRequest;
import com.galaxy_md.entity.User;
import com.galaxy_md.mapper.AuthMapper;
import com.galaxy_md.security.JwtService;
import com.galaxy_md.security.UserPrincipal;
import com.galaxy_md.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        User user = authService.register(request);
        response.addHeader(HttpHeaders.SET_COOKIE, jwtService.buildAuthCookie(user).toString());
        return AuthMapper.toAuthResponse(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        User user = authService.login(request);
        response.addHeader(HttpHeaders.SET_COOKIE, jwtService.buildAuthCookie(user).toString());
        return AuthMapper.toAuthResponse(user);
    }

    @PostMapping("/logout")
    public void logout(@AuthenticationPrincipal UserPrincipal principal, HttpServletResponse response) {
        // Logging out without a valid cookie is not an error: there is simply nothing
        // left to revoke, and the browser is told to drop the cookie either way.
        if (principal != null) {
            authService.logout(principal.getId());
        }
        response.addHeader(HttpHeaders.SET_COOKIE, jwtService.buildLogoutCookie().toString());
    }

    @GetMapping("/me")
    public AuthResponse me(@AuthenticationPrincipal UserPrincipal principal) {
        return AuthMapper.toAuthResponse(principal.getUser());
    }

    @PatchMapping("/username")
    public AuthResponse updateUsername(@Valid @RequestBody UpdateUsernameRequest request,
                                        @AuthenticationPrincipal UserPrincipal principal) {
        User user = authService.updateUsername(principal.getId(), request.getUsername());
        return AuthMapper.toAuthResponse(user);
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(@Valid @RequestBody DeleteAccountRequest request,
                               @AuthenticationPrincipal UserPrincipal principal,
                               HttpServletResponse response) {
        authService.deleteAccount(principal.getId(), request.getPassword());
        response.addHeader(HttpHeaders.SET_COOKIE, jwtService.buildLogoutCookie().toString());
    }
}

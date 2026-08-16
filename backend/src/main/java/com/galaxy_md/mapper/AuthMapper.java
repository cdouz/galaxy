package com.galaxy_md.mapper;

import com.galaxy_md.dto.AuthResponse;
import com.galaxy_md.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
    public static AuthResponse toAuthResponse(User user) {
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}

package com.galaxy_md.mapper;

import com.galaxy_md.dto.AuthResponse;
import com.galaxy_md.entity.User;

/** Static mapping helpers; not a bean, nothing here needs the container. */
public final class AuthMapper {

    private AuthMapper() {
    }

    public static AuthResponse toAuthResponse(User user) {
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}

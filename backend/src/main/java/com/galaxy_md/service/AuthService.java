package com.galaxy_md.service;

import com.galaxy_md.dto.LoginRequest;
import com.galaxy_md.dto.RegisterRequest;
import com.galaxy_md.entity.User;

public interface AuthService {
    User register(RegisterRequest request);
    User login(LoginRequest request);
}

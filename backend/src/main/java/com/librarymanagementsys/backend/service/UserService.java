package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.dto.LoginRequest;
import com.librarymanagementsys.backend.dto.RegisterRequest;
import com.librarymanagementsys.backend.exception.EmailAlreadyExistsException;
import com.librarymanagementsys.backend.exception.InvalidCredentialsException;
import com.librarymanagementsys.backend.exception.UserNotFoundException;
import com.librarymanagementsys.backend.model.User;
import com.librarymanagementsys.backend.repository.UserRepository;
import com.librarymanagementsys.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already in use");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                request.getUniversityId(),
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);
        return jwtUtil.generateToken(user.getEmail());
    }

    public String loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + request.getEmail());
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Incorrect password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}

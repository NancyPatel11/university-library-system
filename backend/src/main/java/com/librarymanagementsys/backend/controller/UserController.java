package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.LoginRequest;
import com.librarymanagementsys.backend.dto.RegisterRequest;
import com.librarymanagementsys.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> registerUser(@ModelAttribute RegisterRequest request) {
        String generatedJwtToken = userService.registerUser(request);

        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "User registered successfully",
                "token", generatedJwtToken
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequest request) {
        String token = userService.loginUser(request);

        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "Login successful",
                "token", token
        ));
    }
}

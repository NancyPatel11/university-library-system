package com.librarymanagementsys.backend.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/check-token")
    public ResponseEntity<?> checkAuth(HttpSession session) {
        String jwt = (String) session.getAttribute("jwt");
        String email = (String) session.getAttribute("email");

        if (jwt == null || email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Authenticated",
                "email", email
        ));
    }
}
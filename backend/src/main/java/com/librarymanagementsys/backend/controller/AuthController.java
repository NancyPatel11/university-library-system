package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.security.JwtUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/check-token")
    public ResponseEntity<?> checkAuth(HttpSession session) {

        String jwt = (String) session.getAttribute("jwt");
        String sessionEmail = (String) session.getAttribute("email");
        String sessionRole = (String) session.getAttribute("role");

        if (jwt == null || sessionEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
        }

        // Validate token and extract email
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired token"));
        }

        String tokenEmail = jwtUtil.extractEmail(jwt);

        if (!tokenEmail.equals(sessionEmail)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token email mismatch"));
        }

        return ResponseEntity.ok(Map.of(
                "message", "User is authenticated",
                "email", tokenEmail,
                "role", sessionRole
        ));
    }
}

package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.security.JwtUtil;
import com.librarymanagementsys.backend.service.AuthService;
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

    @Autowired
    private AuthService authService;

    @GetMapping("/check-token")
    public ResponseEntity<?> checkAuth(HttpSession session) {
        System.out.println("Checking authentication status...");
        if(session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthenticated user. Login again or check if the account exists."));
        }

        String jwt = (String) session.getAttribute("jwt");
        String sessionEmail = (String) session.getAttribute("email");
        String sessionRole = (String) session.getAttribute("role");
        String sessionFullName = (String) session.getAttribute("fullName");
        String sessionUserId = (String) session.getAttribute("userId");

        if (jwt == null || sessionEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
        }

        // Check if the user exists based on their role
        boolean exists = "admin".equalsIgnoreCase(sessionRole)
                ? authService.adminExists(sessionEmail)
                : authService.userExists(sessionEmail);
        System.out.println("User exists: " + exists + ", Role: " + sessionRole + ", Email: " + sessionEmail);
        if (!exists) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Account no longer exists. Check with the admin for more details."));
        }

        // Validate the JWT token
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
                "role", sessionRole,
                "name", sessionFullName,
                "userId", sessionUserId
        ));
    }

}

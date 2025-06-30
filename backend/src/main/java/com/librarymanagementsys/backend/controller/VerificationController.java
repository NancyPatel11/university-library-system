package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.service.VerificationService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email == null) return ResponseEntity.status(401).body("Not logged in");

        try {
            verificationService.generateAndSendCode(email);
            return ResponseEntity.ok(Map.of("message", "Verification code sent to email"));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> body, HttpSession session) {
        String email = (String) session.getAttribute("email");
        String code = body.get("code");

        if (email == null || code == null) {
            return ResponseEntity.badRequest().body("Missing info");
        }

        boolean success = verificationService.verifyCodeAndMarkVerified(email, code);
        if (!success) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired code"));
        }

        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }
}

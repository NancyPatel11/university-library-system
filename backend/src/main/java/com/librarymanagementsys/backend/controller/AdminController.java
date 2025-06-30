package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.LoginAdminRequest;
import com.librarymanagementsys.backend.dto.LoginResponse;
import com.librarymanagementsys.backend.dto.RegisterAdminRequest;
import com.librarymanagementsys.backend.dto.RegisterResponse;
import com.librarymanagementsys.backend.service.AdminService;
import com.librarymanagementsys.backend.session.SessionRegistry;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private SessionRegistry sessionRegistry;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private AdminService adminService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> registerAdmin(
            @RequestPart("request") RegisterAdminRequest request,
            HttpSession session) {

        RegisterResponse registerResponse = adminService.registerAdmin(request);
        session.setAttribute("jwt", registerResponse.getJwt());
        session.setAttribute("userId", registerResponse.getUserId());
        session.setAttribute("email", request.getEmail());
        session.setAttribute("role", "admin");
        session.setAttribute("fullName", request.getFullName());

        sessionRegistry.registerSession(request.getEmail(), session); // add tracking in session registry

        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "User registered successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginAdminRequest request,
                                                         HttpSession session) {
        LoginResponse loginResponse = adminService.loginAdmin(request, session);

        // Store in session
        session.setAttribute("jwt", loginResponse.getJwt());
        session.setAttribute("userId", loginResponse.getUserId());
        session.setAttribute("email", request.getEmail());
        session.setAttribute("role", "admin");
        session.setAttribute("fullName", loginResponse.getFullName());

        sessionRegistry.registerSession(request.getEmail(), session); // add tracking in session registry

        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "Login successful"
        ));
    }

    @GetMapping("/check-email-verification")
    public ResponseEntity<?> checkEmailVerification(HttpSession session) {
        String sessionEmail = (String) session.getAttribute("email");
        if (sessionEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 401,
                    "message", "Unauthorized access"
            ));
        }
        boolean isVerified = adminService.checkEmailVerification(sessionEmail);
        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "Email verification status retrieved successfully",
                "isVerified", isVerified
        ));
    }


    @GetMapping("/logout")
    public ResponseEntity<?> logoutAdmin(HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null) {
            sessionRegistry.removeSession(email); // Remove tracking from session registry
        }

        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/allAdmins")
    public ResponseEntity<?> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> deleteAdmin(@PathVariable String email) {
        String sessionId = sessionRegistry.getSessionId(email);
        if (sessionId != null) {
            String redisKey = "spring:session:sessions:" + sessionId;
            redisTemplate.delete(redisKey); // manually removes session from Redis
            sessionRegistry.removeSession(email);
        }

        adminService.deleteAdmin(email);
        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "Admin deleted successfully"
        ));
    }

}

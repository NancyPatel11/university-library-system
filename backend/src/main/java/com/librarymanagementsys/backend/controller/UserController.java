package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.LoginRequest;
import com.librarymanagementsys.backend.dto.LoginResponse;
import com.librarymanagementsys.backend.dto.RegisterRequest;
import com.librarymanagementsys.backend.dto.RegisterResponse;
import com.librarymanagementsys.backend.exception.UserNotFoundException;
import com.librarymanagementsys.backend.service.UserService;
import com.librarymanagementsys.backend.session.SessionRegistry;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private SessionRegistry sessionRegistry;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private UserService userService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> registerUser(
            @RequestPart("request") RegisterRequest request,
            @RequestPart("idCardImage") MultipartFile idCardImage,
            HttpSession session) {

        RegisterResponse registerResponse = userService.registerUser(request, idCardImage);
        session.setAttribute("jwt", registerResponse.getJwt());
        session.setAttribute("userId", registerResponse.getUserId());
        session.setAttribute("email", request.getEmail());
        session.setAttribute("role", "student");
        session.setAttribute("fullName", request.getFullName());

        sessionRegistry.registerSession(request.getEmail(), session); // add tracking in session registry

        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "User registered successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request, HttpSession session) {
        LoginResponse loginResponse = userService.loginUser(request,session);

        // Store in session
        session.setAttribute("jwt", loginResponse.getJwt());
        session.setAttribute("userId", loginResponse.getUserId());
        session.setAttribute("email", request.getEmail());
        session.setAttribute("role", "student");
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
        boolean isVerified = userService.checkEmailVerification(sessionEmail);
        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "Email verification status retrieved successfully",
                "isVerified", isVerified
        ));
    }


    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(userService.getUserById(userId));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 404,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 500,
                    "message", "Failed to fetch user: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/idcard/{email}")
    public ResponseEntity<byte[]> getIdCard(@PathVariable String email) {
        return userService.getUserIdCardResponse(email);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserByEmail(HttpSession session) {
        String email = (String) session.getAttribute("email");
        try {
            return ResponseEntity.ok(userService.getUserByEmail(email));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 404,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null) {
            sessionRegistry.removeSession(email); // Remove tracking from session registry
        }

        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/allUsers")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        try {
            String sessionId = sessionRegistry.getSessionId(email);
            if (sessionId != null) {
                String redisKey = "spring:session:sessions:" + sessionId;
                redisTemplate.delete(redisKey); // manually removes session from Redis
                sessionRegistry.removeSession(email);
            }

            userService.deleteUser(email);
            return ResponseEntity.ok(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 200,
                    "message", "User deleted successfully"
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 409,
                    "message", e.getMessage()
            ));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 404,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 500,
                    "message", "Failed to delete user: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/approve/{email}")
    public ResponseEntity<?> approveUser(@PathVariable String email) {
        userService.approveUser(email);
        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "User approved successfully"
        ));
    }

    @PutMapping("/deny/{email}")
    public ResponseEntity<?> denyUser(@PathVariable String email) {
        userService.denyUser(email);
        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "User denied successfully"
        ));
    }

    @GetMapping("/accountStatus")
    public ResponseEntity<?> getUserStatus(HttpSession session) {
        String email = (String) session.getAttribute("email");
        String accountStatus = userService.getUserStatus(email);
        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "User status retrieved successfully",
                "accountStatus", accountStatus
        ));
    }

}

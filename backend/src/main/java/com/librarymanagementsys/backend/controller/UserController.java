package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.LoginRequest;
import com.librarymanagementsys.backend.dto.RegisterRequest;
import com.librarymanagementsys.backend.exception.UserNotFoundException;
import com.librarymanagementsys.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
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
    private UserService userService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> registerUser(
            @RequestPart("request") RegisterRequest request,
            @RequestPart("idCardImage") MultipartFile idCardImage,
            HttpSession session) {

        String jwt = userService.registerUser(request, idCardImage);
        session.setAttribute("jwt", jwt);
        session.setAttribute("email", request.getEmail());
        session.setAttribute("role", "student");
        session.setAttribute("fullName", request.getFullName());

        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "User registered successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request, HttpSession session) {
        String token = userService.loginUser(request,session);

        // Store in session
        session.setAttribute("jwt", token);
        session.setAttribute("email", request.getEmail());
        session.setAttribute("role", "student");


        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "Login successful"
        ));
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
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/allUsers")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        userService.deleteUser(email);
        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "User deleted successfully"
        ));
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

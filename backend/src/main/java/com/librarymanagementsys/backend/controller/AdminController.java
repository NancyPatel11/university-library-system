package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.LoginAdminRequest;
import com.librarymanagementsys.backend.dto.LoginResponse;
import com.librarymanagementsys.backend.dto.RegisterAdminRequest;
import com.librarymanagementsys.backend.dto.RegisterResponse;
import com.librarymanagementsys.backend.service.AdminService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> registerAdmin(
            @RequestPart("request") RegisterAdminRequest request,
            HttpSession session) {
        System.out.println("Registering admin: " + request.getEmail());

        RegisterResponse registerResponse = adminService.registerAdmin(request);
        session.setAttribute("jwt", registerResponse.getJwt());
        session.setAttribute("userId", registerResponse.getUserId());
        session.setAttribute("email", request.getEmail());
        session.setAttribute("role", "admin");
        session.setAttribute("fullName", request.getFullName());

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

        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "Login successful"
        ));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutAdmin(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/allAdmins")
    public ResponseEntity<?> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> deleteAdmin(@PathVariable String email) {
        adminService.deleteAdmin(email);
        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "Admin deleted successfully"
        ));
    }

}

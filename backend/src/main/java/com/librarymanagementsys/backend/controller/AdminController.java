package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.RegisterAdminRequest;
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

        String jwt = adminService.registerAdmin(request);
        session.setAttribute("jwt", jwt);
        session.setAttribute("email", request.getEmail());
        session.setAttribute("role", "admin");

        return ResponseEntity.ok(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 200,
                "message", "User registered successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody RegisterAdminRequest request,
                                                         HttpSession session) {
        String jwt = adminService.loginAdmin(request);

        // Store in session
        session.setAttribute("jwt", jwt);
        session.setAttribute("email", request.getEmail());
        session.setAttribute("role", "admin");

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

}

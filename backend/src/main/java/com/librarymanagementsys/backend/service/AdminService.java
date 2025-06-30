package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.dto.LoginAdminRequest;
import com.librarymanagementsys.backend.dto.LoginResponse;
import com.librarymanagementsys.backend.dto.RegisterAdminRequest;
import com.librarymanagementsys.backend.dto.RegisterResponse;
import com.librarymanagementsys.backend.exception.EmailAlreadyExistsException;
import com.librarymanagementsys.backend.exception.InvalidCredentialsException;
import com.librarymanagementsys.backend.exception.UserNotFoundException;
import com.librarymanagementsys.backend.model.Admin;
import com.librarymanagementsys.backend.model.User;
import com.librarymanagementsys.backend.repository.AdminRepository;
import com.librarymanagementsys.backend.security.JwtUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository, JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public RegisterResponse registerAdmin(RegisterAdminRequest request) {
        if (adminRepository.findByEmail(request.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email already in use");
        }

        Admin admin = new Admin();
        admin.setFullName(request.getFullName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setMobileNumber(request.getMobileNumber());
        admin.setRegistrationDate(new Date());

        adminRepository.save(admin);

        RegisterResponse registerResponse = new RegisterResponse();
        registerResponse.setUserId(admin.getId());
        registerResponse.setJwt(jwtUtil.generateToken(admin.getEmail()));

        return registerResponse;
    }

    public LoginResponse loginAdmin(LoginAdminRequest request, HttpSession session) {
        Admin admin = adminRepository.findByEmail(request.getEmail());
        if (admin == null) {
            throw new UserNotFoundException("Admin user not found with email: " + request.getEmail());
        }

        session.setAttribute("fullName", admin.getFullName());

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new InvalidCredentialsException("Incorrect password");
        }

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUserId(admin.getId());
        loginResponse.setFullName(admin.getFullName());
        loginResponse.setJwt(jwtUtil.generateToken(admin.getEmail()));

        return loginResponse;
    }

    public boolean checkEmailVerification(String email) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            throw new UserNotFoundException("Admin user not found with email: " + email);
        }
        return admin.isEmailVerified();
    }

    public List<Admin> getAllAdmins(){
        try{
            return adminRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch users: " + e.getMessage());
        }
    }

    public void deleteAdmin(String email) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            throw new UserNotFoundException("Admin user not found with email: " + email);
        }

        try {
            adminRepository.delete(admin);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete admin: " + e.getMessage());
        }
    }



}

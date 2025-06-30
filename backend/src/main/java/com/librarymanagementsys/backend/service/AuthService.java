package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.repository.AdminRepository;
import com.librarymanagementsys.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    public boolean userExists(String email) {
        return userRepository.findByEmail(email) != null;
    }

    public boolean adminExists(String email) {
        return adminRepository.findByEmail(email) != null;
    }
}

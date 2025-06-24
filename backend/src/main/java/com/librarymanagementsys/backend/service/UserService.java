package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.dto.LoginRequest;
import com.librarymanagementsys.backend.dto.LoginResponse;
import com.librarymanagementsys.backend.dto.RegisterRequest;
import com.librarymanagementsys.backend.dto.RegisterResponse;
import com.librarymanagementsys.backend.exception.EmailAlreadyExistsException;
import com.librarymanagementsys.backend.exception.ImageNotSaved;
import com.librarymanagementsys.backend.exception.InvalidCredentialsException;
import com.librarymanagementsys.backend.exception.UserNotFoundException;
import com.librarymanagementsys.backend.model.User;
import com.librarymanagementsys.backend.repository.UserRepository;
import com.librarymanagementsys.backend.security.JwtUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public RegisterResponse registerUser(RegisterRequest request, MultipartFile idCardImage) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already in use");
        }

        byte[] idCardBytes = null;
        try {
            idCardBytes = idCardImage.getBytes();
        } catch (IOException e) {
            throw new ImageNotSaved("Failed to save ID card image: " + e.getMessage());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setUniversityId(request.getUniversityId());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setIdCardName(idCardImage.getOriginalFilename());
        user.setIdCardType(idCardImage.getContentType());
        user.setIdCard(idCardBytes); // ✅ Save the image
        user.setAccountStatus("Verification Pending"); // Initial status
        user.setRegistrationDate(new Date());

        userRepository.save(user);
        RegisterResponse response = new RegisterResponse();
        response.setUserId(user.getId());
        response.setJwt(jwtUtil.generateToken(user.getEmail()));
        return response;
    }

    public LoginResponse loginUser(LoginRequest request, HttpSession session) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + request.getEmail());
        }

        session.setAttribute("fullName", user.getFullName());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Incorrect password");
        }

        LoginResponse response = new LoginResponse();
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setJwt( jwtUtil.generateToken(user.getEmail()));
        return response;
    }

    public ResponseEntity<byte[]> getUserIdCardResponse(String email) {
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new UserNotFoundException("User not found with email: " + email);
            }

            byte[] image = user.getIdCard();
            if (image == null) {
                throw new ImageNotSaved("ID card image not found for user: " + email);
            }

            String contentType = user.getIdCardType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = "image/jpeg"; // fallback
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(image);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        return user;
    }

    public List<User> getAllUsers() {
        try{
            return userRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch users: " + e.getMessage());
        }
    }

    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }

        if(user.getNoBooksBorrowed() > 0){
            throw new IllegalStateException("Cannot delete user with borrowed books");
        }

        try{
            userRepository.delete(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete user: " + e.getMessage());
        }
    }

    public void approveUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }

        user.setAccountStatus("Verified");

        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to approve user: " + e.getMessage());
        }
    }

    public void denyUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }

        user.setAccountStatus("Denied");

        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to deny user: " + e.getMessage());
        }
    }

    public String getUserStatus(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        return user.getAccountStatus();
    }
}

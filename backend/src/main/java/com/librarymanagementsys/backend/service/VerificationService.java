package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.model.Admin;
import com.librarymanagementsys.backend.model.User;
import com.librarymanagementsys.backend.repository.AdminRepository;
import com.librarymanagementsys.backend.repository.UserRepository;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    private final Map<String, String> emailCodeMap = new ConcurrentHashMap<>();
    private final Map<String, Long> expiryMap = new ConcurrentHashMap<>();
    private static final long EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes

    public VerificationService(JavaMailSender mailSender,
                               UserRepository userRepository,
                               AdminRepository adminRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    public void generateAndSendCode(String email) {
        if (userRepository.findByEmail(email) == null && adminRepository.findByEmail(email) == null) {
            throw new RuntimeException("User/Admin not found with email: " + email);
        }

        String code = String.valueOf(100000 + new Random().nextInt(900000));
//        System.out.println("Generated verification code for " + email + ": " + code);
        emailCodeMap.put(email, code);
        expiryMap.put(email, System.currentTimeMillis() + EXPIRY_DURATION);

        sendVerificationCode(email, code);
    }

    public boolean verifyCodeAndMarkVerified(String email, String code) {
        String storedCode = emailCodeMap.get(email);
        Long expiry = expiryMap.get(email);

        if (storedCode == null || expiry == null || System.currentTimeMillis() > expiry) {
            return false;
        }

        if (!storedCode.equals(code)) {
            return false;
        }

        // Mark user or admin as verified
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setEmailVerified(true);
            userRepository.save(user);
        }

        Admin admin = adminRepository.findByEmail(email);
        if (admin != null) {
            admin.setEmailVerified(true);
            adminRepository.save(admin);
        }

        clearCode(email);
        return true;
    }

    public void clearCode(String email) {
        emailCodeMap.remove(email);
        expiryMap.remove(email);
    }

    private void sendVerificationCode(String to, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Bookademia Verification Code");
            message.setText("Your code is: " + code);
            message.setFrom("your_email@gmail.com");

            mailSender.send(message);
        } catch (MailException ex) {
            System.err.println("Failed to send email: " + ex.getMessage());
            throw new RuntimeException("Email could not be sent. Check SMTP configuration.", ex);
        }
    }
}

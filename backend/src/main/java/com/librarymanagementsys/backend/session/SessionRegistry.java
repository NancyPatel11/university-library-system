package com.librarymanagementsys.backend.session;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionRegistry {

    private final ConcurrentHashMap<String, String> sessionMap = new ConcurrentHashMap<>();

    public void registerSession(String email, HttpSession session) {
        System.out.println("Registering session for: " + email);
        sessionMap.put(email, session.getId());
    }

    public String getSessionId(String email) {
        System.out.println("Getting session ID for: " + email);
        return sessionMap.get(email);
    }

    public void removeSession(String email) {
        System.out.println("Removing session tracking for: " + email);
        sessionMap.remove(email);
    }
}
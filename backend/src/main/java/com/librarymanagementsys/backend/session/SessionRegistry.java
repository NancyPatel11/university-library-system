package com.librarymanagementsys.backend.session;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionRegistry {

    private final ConcurrentHashMap<String, String> sessionMap = new ConcurrentHashMap<>();

    public void registerSession(String email, HttpSession session) {
        sessionMap.put(email, session.getId());
    }

    public String getSessionId(String email) {
        return sessionMap.get(email);
    }

    public void removeSession(String email) {
        sessionMap.remove(email);
    }
}
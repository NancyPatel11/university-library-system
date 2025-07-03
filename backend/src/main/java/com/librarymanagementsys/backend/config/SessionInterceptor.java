package com.librarymanagementsys.backend.config;

import com.librarymanagementsys.backend.session.SessionRegistry;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class SessionInterceptor implements HandlerInterceptor {

    @Autowired
    private SessionRegistry sessionRegistry;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);

        if (session == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"message\": \"No active session. Reload the page to login again.\"}");
            return false;
        }

        String email = (String) session.getAttribute("email");
        String trackedSessionId = sessionRegistry.getSessionId(email);

        if (email == null || trackedSessionId == null || !trackedSessionId.equals(session.getId())) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"message\": \"Session is invalid or user was deleted.\"}");
            return false;
        }
        return true;
    }
}


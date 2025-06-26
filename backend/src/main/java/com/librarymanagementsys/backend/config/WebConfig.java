package com.librarymanagementsys.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private SessionInterceptor sessionInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionInterceptor)
                .addPathPatterns("/api/**")  // apply to all protected routes
                .excludePathPatterns(
                        "/api/user/login",
                        "/api/user/register",
                        "/api/admin/login",
                        "/api/admin/register",
                        "/api/auth/check-token"
                ); // exclude public routes
    }
}

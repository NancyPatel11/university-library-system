package com.librarymanagementsys.backend;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RedisURLLogger {

    @Value("${spring.redis.url:NOT_SET}")
    private String redisUrl;

    @PostConstruct
    public void log() {
        System.out.println("🚨 RESOLVED spring.redis.url = " + redisUrl);
    }
}

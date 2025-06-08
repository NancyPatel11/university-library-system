package com.librarymanagementsys.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public String sayHello() {
        System.out.println("Hello endpoint was called");
        return "Hello, World!";
    }
}

package com.librarymanagementsys.backend.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String jwt;
    private String userId;
    private String fullName;
}

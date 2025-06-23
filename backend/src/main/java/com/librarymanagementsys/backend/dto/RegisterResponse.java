package com.librarymanagementsys.backend.dto;

import lombok.Data;

@Data
public class RegisterResponse {
    private String jwt;
    private String userId;
}

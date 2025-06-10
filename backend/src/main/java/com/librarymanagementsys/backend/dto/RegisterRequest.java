package com.librarymanagementsys.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String universityId;
    private String password;
}

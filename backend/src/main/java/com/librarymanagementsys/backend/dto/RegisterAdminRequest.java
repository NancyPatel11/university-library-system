package com.librarymanagementsys.backend.dto;

import lombok.Data;

@Data
public class RegisterAdminRequest {
    private String fullName;
    private String email;
    private String password;
    private String mobileNumber;
}

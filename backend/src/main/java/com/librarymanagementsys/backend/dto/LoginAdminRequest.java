package com.librarymanagementsys.backend.dto;

import lombok.Data;

@Data
public class LoginAdminRequest {
    private String email;
    private String password;
}

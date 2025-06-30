package com.librarymanagementsys.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "Admins")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Admin {
    @Id
    private String id;

    private String fullName;
    private String email;
    private String password;
    private String mobileNumber;
    private Date registrationDate;
    private boolean isEmailVerified = false; // Default false, to be set after email verification
}

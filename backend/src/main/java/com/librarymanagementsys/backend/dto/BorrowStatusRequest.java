package com.librarymanagementsys.backend.dto;

import lombok.Data;

@Data
public class BorrowStatusRequest {
    private String bookId; // ID of the book for which the status is being checked
    private String studentId; // Id of the student who made the request
}

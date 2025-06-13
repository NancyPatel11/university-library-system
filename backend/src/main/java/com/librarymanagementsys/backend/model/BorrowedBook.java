package com.librarymanagementsys.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BorrowedBook {
    private String bookId;
    private LocalDate issueDate;
    private LocalDate returnDate;
    private String Status; // Status can be "Borrow Request Pending", "Borrowed", "Returned", or "Overdue"
}
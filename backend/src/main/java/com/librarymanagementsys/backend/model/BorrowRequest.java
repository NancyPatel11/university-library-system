package com.librarymanagementsys.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "BorrowRequests")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BorrowRequest {
    @Id
    private String id;

    private String bookId; // ID of the book being requested
    private String studentEmail; // email of the student requesting the book
    private String status; // "Pending", "Approved", or "Rejected"
    private Date requestDate;  // the date when the request was made by the student
    private Date issueDate;  // the date when the book was issued to the student
    private Date returnDate; // the date when the book is expected to be returned by the student
}
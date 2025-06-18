package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.model.BorrowRequest;
import com.librarymanagementsys.backend.repository.BorrowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class BorrowRequestService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    public void createBorrowRequest(BorrowRequest borrowRequest) {
        borrowRequest.setStatus("Pending"); // Set default status to "Pending"
        borrowRequest.setRequestDate(new Date()); // Set the request date to the current date
        borrowRequest.setIssueDate(null); // Initially, issue date is null
        borrowRequest.setReturnDate(null); // Initially, return date is null
        try {
            borrowRequestRepository.save(borrowRequest);
        }
        catch (Exception e) {
            throw new RuntimeException("Error saving borrow request: " + e.getMessage());
        }
    }

    public BorrowRequest checkBorrowRequestStatus(String studentEmail, String bookId) {
        // Find the borrow request by student email and book ID
        BorrowRequest borrowRequest = borrowRequestRepository.findByStudentEmailAndBookId(studentEmail, bookId);

        if (borrowRequest == null) {
            throw new RuntimeException("Borrow request not found for student: " + studentEmail + " and book: " + bookId);
        }

        return borrowRequest; // Return the found borrow request
    }

    public List<BorrowRequest> getMyBorrowedBooks(String studentEmail) {
        // Fetch all borrow requests for the given student email
        List<BorrowRequest> borrowedBooks = borrowRequestRepository.findByStudentEmail(studentEmail);

        if (borrowedBooks.isEmpty()) {
           return List.of(); // Return an empty list if no borrowed books found
        }
        return borrowedBooks; // Return the list of borrowed books
    }
}
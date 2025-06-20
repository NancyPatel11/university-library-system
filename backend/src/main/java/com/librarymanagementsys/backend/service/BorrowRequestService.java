package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.model.Book;
import com.librarymanagementsys.backend.model.BorrowRequest;
import com.librarymanagementsys.backend.model.User;
import com.librarymanagementsys.backend.repository.BookRepository;
import com.librarymanagementsys.backend.repository.BorrowRequestRepository;
import com.librarymanagementsys.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class BorrowRequestService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

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

    public List<BorrowRequest> getAllBorrowRequests() {
        // Fetch all borrow requests from the repository
        List<BorrowRequest> allBorrowRequests = borrowRequestRepository.findAll();

        if (allBorrowRequests.isEmpty()) {
            return List.of(); // Return an empty list if no borrow requests found
        }
        return allBorrowRequests; // Return the list of all borrow requests
    }

    public BorrowRequest approveBorrowRequest(String requestId) {
        // Find the borrow request by ID
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Borrow request not found with ID: " + requestId));

        Book book = bookRepository.findById(borrowRequest.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + borrowRequest.getBookId()));

        User user = userRepository.findByEmail(borrowRequest.getStudentEmail());

        try {
            user.setNoBooksBorrowed(user.getNoBooksBorrowed() + 1); // Increment the number of books borrowed by the user
            book.setAvailable_copies(book.getAvailable_copies() - 1); // Decrease the available copies of the book
            borrowRequest.setStatus("Borrowed");
            borrowRequest.setIssueDate(new Date()); // Set the issue date to the current date
            borrowRequest.setDueDate(new Date(System.currentTimeMillis() + 14 * 24 * 60 * 60 * 1000)); // Set due date to 14 days from now
            borrowRequestRepository.save(borrowRequest); // Save the updated borrow request
            bookRepository.save(book); // Save the updated book information
            userRepository.save(user); // Save the updated user information
            return borrowRequest; // Return the updated borrow request
        }
        catch (Exception e) {
            throw new RuntimeException("Error approving borrow request: " + e.getMessage());
        }
    }

    public String returnBook(String requestId) {
        // Find the borrow request by ID
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Borrow request not found with ID: " + requestId));

        Book book = bookRepository.findById(borrowRequest.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + borrowRequest.getBookId()));

        User user = userRepository.findByEmail(borrowRequest.getStudentEmail());

        try {
            user.setNoBooksBorrowed(user.getNoBooksBorrowed() - 1); // Decrement the number of books borrowed by the user
            book.setAvailable_copies(book.getAvailable_copies() + 1); // Increase the available copies of the book
            borrowRequest.setStatus("Returned"); // Update the status to "Returned"
            borrowRequest.setReturnDate(new Date()); // Set the return date to the current date
            borrowRequestRepository.save(borrowRequest); // Save the updated borrow request
            bookRepository.save(book); // Save the updated book information
            return "Book returned successfully";
        }
        catch (Exception e) {
            throw new RuntimeException("Error returning book: " + e.getMessage());
        }
    }
}
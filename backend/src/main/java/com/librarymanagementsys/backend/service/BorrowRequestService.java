package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.exception.BookNotAvailableException;
import com.librarymanagementsys.backend.model.Book;
import com.librarymanagementsys.backend.model.BorrowRequest;
import com.librarymanagementsys.backend.model.User;
import com.librarymanagementsys.backend.repository.BookRepository;
import com.librarymanagementsys.backend.repository.BorrowRequestRepository;
import com.librarymanagementsys.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
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

    @Autowired
    private MailService mailService;

    // Only checking if today's date is after the due date (ignoring the time part)
    private boolean isDateAfter(Date d1, Date d2) {
        LocalDate date1 = d1.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate date2 = d2.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        return date1.isAfter(date2);
    }

    // Only checking if today's date is the same as the due date (ignoring the time part)
    private boolean isToday(Date today, Date dueDate) {
        LocalDate todayDate = today.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate dueDateLocal = dueDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        return todayDate.isEqual(dueDateLocal);
    }

    public void createBorrowRequest(BorrowRequest borrowRequest) {

        Book book = bookRepository.findById(borrowRequest.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + borrowRequest.getBookId()));

        if(book.getAvailable_copies() <= 0) {
            throw new BookNotAvailableException(book.getTitle() + " is not available for borrowing. Check the available copies and try again later.");
        }

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

    public BorrowRequest checkBorrowRequestStatus(String studentId, String bookId) {
        List<BorrowRequest> borrowRequests = borrowRequestRepository.findByStudentIdAndBookId(studentId, bookId);

        if (borrowRequests == null || borrowRequests.isEmpty()) {
            return null; // No borrow requests found
        }

        // Return the most recent request by requestDate
        return borrowRequests.stream()
                .max(Comparator.comparing(BorrowRequest::getRequestDate))
                .orElse(null);
    }

    public List<BorrowRequest> getMyBorrowedBooks(String studentId) {
        // Fetch all borrow requests for the given student email
        List<BorrowRequest> borrowedBooks = borrowRequestRepository.findByStudentId(studentId);

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

        User user = userRepository.findById(borrowRequest.getStudentId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + borrowRequest.getStudentId()));

        // Check if the book is available for borrowing
        if (book.getAvailable_copies() <= 0) {
            throw new BookNotAvailableException( book.getTitle() + " is not available for borrowing. Check the available copies and try again later.");
        }

        try {
            user.setNoBooksBorrowed(user.getNoBooksBorrowed() + 1); // Increment the number of books borrowed by the user
            book.setAvailable_copies(book.getAvailable_copies() - 1); // Decrease the available copies of the book
            borrowRequest.setStatus("Borrowed");
            borrowRequest.setIssueDate(new Date()); // Set the issue date to the current date
            borrowRequest.setDueDate(new Date(System.currentTimeMillis() + 14 * 24 * 60 * 60 * 1000)); // Set due date to 14 days from now
            borrowRequestRepository.save(borrowRequest); // Save the updated borrow request
            bookRepository.save(book); // Save the updated book information
            userRepository.save(user); // Save the updated user information

            try {
                SimpleDateFormat formatter = new SimpleDateFormat("dd MMMM, yyyy");

                String formattedIssueDate = formatter.format(borrowRequest.getIssueDate());
                String formattedDueDate = formatter.format(borrowRequest.getDueDate());

                mailService.sendBorrowConfirmationMail(
                        user.getEmail(),
                        user.getFullName(),
                        book.getTitle(),
                        formattedIssueDate,
                        formattedDueDate
                );
            } catch (Exception e) {
                System.err.println("Warning: Borrow request approved but confirmation email not sent due to internal issues: " + e.getMessage());
            }


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

        User user = userRepository.findById(borrowRequest.getStudentId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + borrowRequest.getStudentId()));

        try {
            user.setNoBooksBorrowed(user.getNoBooksBorrowed() - 1); // Decrement the number of books borrowed by the user
            book.setAvailable_copies(book.getAvailable_copies() + 1); // Increase the available copies of the book

            Date today = new Date();
            if(borrowRequest.getDueDate() != null && isDateAfter(today, borrowRequest.getDueDate())) {
                // If the book is returned after the due date
                borrowRequest.setStatus("Late Return");
            } else {
                borrowRequest.setStatus("Returned");
            }
            borrowRequest.setReturnDate(new Date()); // Set the return date to the current date
            borrowRequestRepository.save(borrowRequest); // Save the updated borrow request
            bookRepository.save(book); // Save the updated book information
            userRepository.save(user); // Save the updated user information

            try{
                if(borrowRequest.getStatus().equals("Returned")) {
                    mailService.sendReturnConfirmationMail(
                            user.getEmail(),
                            user.getFullName(),
                            book.getTitle()
                    );
                }
                else{
                    SimpleDateFormat formatter = new SimpleDateFormat("dd MMMM, yyyy");
                    String formattedDueDate = formatter.format(borrowRequest.getDueDate());
                    String formattedReturnDate = formatter.format(borrowRequest.getReturnDate());

                    mailService.sendLateReturnMail(
                            user.getEmail(),
                            user.getFullName(),
                            book.getTitle(),
                            formattedDueDate,
                            formattedReturnDate
                    );
                }
            } catch (Exception e) {
                System.err.println("Warning: Book returned but confirmation email not sent due to internal issues: " + e.getMessage());
            }
            return "Book returned successfully";
        }
        catch (Exception e) {
            throw new RuntimeException("Error returning book: " + e.getMessage());
        }
    }

    public void deleteBorrowRequest(String requestId) {
        // Find the borrow request by ID
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Borrow request not found with ID: " + requestId));

        try {
            borrowRequestRepository.delete(borrowRequest); // Delete the borrow request
        } catch (Exception e) {
            throw new RuntimeException("Error deleting borrow request: " + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 0 * * *") // daily at midnight
    public void checkOverdueBorrowRequests() {
        List<BorrowRequest> allRequests = borrowRequestRepository.findAll();
        Date today = new Date();

        for (BorrowRequest request : allRequests) {
            if ("Borrowed".equals(request.getStatus())
                    && request.getDueDate() != null
                    && request.getReturnDate() == null
                    && isDateAfter(today, request.getDueDate())) {

                request.setStatus("Overdue");
                borrowRequestRepository.save(request);

                try{
                    SimpleDateFormat formatter = new SimpleDateFormat("dd MMMM, yyyy");

                    String formattedDueDate = formatter.format(request.getDueDate());

                    mailService.sendOverdueReminderMail(
                            request.getStudentEmail(),
                            request.getStudentFullName(),
                            request.getBookTitle(),
                            formattedDueDate
                    );
                } catch (Exception e) {
                    System.err.println("Warning: Overdue reminder email not sent for request ID " + request.getId() + " due to internal issues: " + e.getMessage());
                }
            }

            if ("Borrowed".equals(request.getStatus())
                    && request.getDueDate() != null
                    && request.getReturnDate() == null
                    && isToday(today, request.getDueDate())) {

                try{
                    SimpleDateFormat formatter = new SimpleDateFormat("dd MMMM, yyyy");

                    String formattedDueDate = formatter.format(request.getDueDate());

                    mailService.sendDueReminderMail(
                            request.getStudentEmail(),
                            request.getStudentFullName(),
                            request.getBookTitle(),
                            formattedDueDate
                    );
                } catch (Exception e) {
                    System.err.println("Warning: Due reminder email not sent for request ID " + request.getId() + " due to internal issues: " + e.getMessage());
                }
            }


        }
    }

    public BorrowRequest getBorrowRequestById(String borrowRequestId) {
         return borrowRequestRepository.findById(borrowRequestId)
                .orElseThrow(() -> new RuntimeException("Borrow request not found with ID: " + borrowRequestId));
    }
}
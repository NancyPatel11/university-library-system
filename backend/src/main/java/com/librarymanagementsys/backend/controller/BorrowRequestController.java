package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.BorrowStatusRequest;
import com.librarymanagementsys.backend.model.BorrowRequest;
import com.librarymanagementsys.backend.service.BorrowRequestService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/borrow-requests")
public class BorrowRequestController {

    @Autowired
    private BorrowRequestService borrowRequestService;

    @PostMapping("/create")
    public ResponseEntity<?> createBorrowRequest(@RequestBody BorrowRequest borrowRequest) {
        borrowRequestService.createBorrowRequest(borrowRequest);
        return ResponseEntity.ok("Borrow request created successfully");
    }

    @PostMapping("/check-status")
    public ResponseEntity<?> checkBorrowRequestStatus(@RequestBody BorrowStatusRequest borrowStatusRequest) {
        BorrowRequest borrowRequest = borrowRequestService.checkBorrowRequestStatus(
                borrowStatusRequest.getStudentEmail(),
                borrowStatusRequest.getBookId()
        );

        return ResponseEntity.ok(borrowRequest);
    }

    @GetMapping("/my-borrowed-books")
    public ResponseEntity<?> getMyBorrowedBooks(HttpSession session) {
        String studentEmail = (String) session.getAttribute("email");
        if (studentEmail == null) {
            return ResponseEntity.badRequest().body("No student email found in session");
        }
        return ResponseEntity.ok(borrowRequestService.getMyBorrowedBooks(studentEmail));
    }

    @GetMapping("/all-borrow-requests")
    public ResponseEntity<?> getAllBorrowRequests(){
        return ResponseEntity.ok(borrowRequestService.getAllBorrowRequests());
    }

    @PutMapping("/approve-request/{requestId}")
    public ResponseEntity<BorrowRequest> approveBorrowRequest(@PathVariable String requestId) {
        return ResponseEntity.ok(borrowRequestService.approveBorrowRequest(requestId));
    }

    @PutMapping("/return-book/{requestId}")
    public ResponseEntity<String> returnBook(@PathVariable String requestId) {
        return ResponseEntity.ok(borrowRequestService.returnBook(requestId));
    }
}
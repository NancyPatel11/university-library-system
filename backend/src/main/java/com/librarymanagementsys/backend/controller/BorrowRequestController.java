package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.BorrowStatusRequest;
import com.librarymanagementsys.backend.exception.BookNotAvailableException;
import com.librarymanagementsys.backend.model.BorrowRequest;
import com.librarymanagementsys.backend.service.BorrowRequestService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

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
                borrowStatusRequest.getStudentId(),
                borrowStatusRequest.getBookId()
        );

        if (borrowRequest == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(borrowRequest);
    }

    @GetMapping("/my-borrowed-books")
    public ResponseEntity<?> getMyBorrowedBooks(HttpSession session) {
        String studentId = (String) session.getAttribute("userId");
        if (studentId == null) {
            return ResponseEntity.badRequest().body("No student id found in session");
        }
        return ResponseEntity.ok(borrowRequestService.getMyBorrowedBooks(studentId));
    }

    @GetMapping("/{borrowRequestId}")
    public ResponseEntity<BorrowRequest> getBorrowRequestById(@PathVariable String borrowRequestId) {
        BorrowRequest borrowRequest = borrowRequestService.getBorrowRequestById(borrowRequestId);
        if (borrowRequest == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(borrowRequest);
    }

    @GetMapping("/all-borrow-requests")
    public ResponseEntity<?> getAllBorrowRequests(){
        return ResponseEntity.ok(borrowRequestService.getAllBorrowRequests());
    }

    @PutMapping("/approve-request/{requestId}")
    public ResponseEntity<?> approveBorrowRequest(@PathVariable String requestId) {
        try {
            BorrowRequest updatedRequest = borrowRequestService.approveBorrowRequest(requestId);
            return ResponseEntity.ok(updatedRequest);
        } catch (BookNotAvailableException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) // 409
                    .body(Map.of(
                            "timestamp", LocalDateTime.now(),
                            "status", 409,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 500,
                    "message", "Failed to approve request: " + e.getMessage()
            ));
        }
    }


    @PutMapping("/return-book/{requestId}")
    public ResponseEntity<String> returnBook(@PathVariable String requestId) {
        return ResponseEntity.ok(borrowRequestService.returnBook(requestId));
    }

    @DeleteMapping("/delete-request/{requestId}")
    public ResponseEntity<String> deleteBorrowRequest(@PathVariable String requestId) {
        borrowRequestService.deleteBorrowRequest(requestId);
        return ResponseEntity.ok("Borrow request deleted successfully");
    }
}
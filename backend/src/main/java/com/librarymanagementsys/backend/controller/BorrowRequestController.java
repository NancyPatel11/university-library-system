package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.BorrowStatusRequest;
import com.librarymanagementsys.backend.model.BorrowRequest;
import com.librarymanagementsys.backend.service.BorrowRequestService;
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
}
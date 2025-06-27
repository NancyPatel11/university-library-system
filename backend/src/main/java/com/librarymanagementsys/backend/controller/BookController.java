package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.CreateBookRequest;
import com.librarymanagementsys.backend.dto.RatingRequest;
import com.librarymanagementsys.backend.dto.UpdateBookRequest;
import com.librarymanagementsys.backend.exception.BookNotFoundException;
import com.librarymanagementsys.backend.exception.UserNotFoundException;
import com.librarymanagementsys.backend.service.BookService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping("/allBooks")
    public ResponseEntity<?> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<?> getBookById(@PathVariable String bookId) {
        return ResponseEntity.ok(bookService.getBookById(bookId));
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<?> updateBook(@PathVariable String bookId, @RequestBody UpdateBookRequest request) {
        bookService.updateBook(bookId, request);
        return ResponseEntity.ok(Map.of("message", "Book updated successfully"));
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> searchBooks(@PathVariable String keyword) {
        return ResponseEntity.ok(bookService.searchBooks(keyword));
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<?> deleteBook(@PathVariable String bookId) {
        try{
            bookService.deleteBook(bookId);
            return ResponseEntity.ok(Map.of(
                    "timestamp", System.currentTimeMillis(),
                    "status", 200,
                    "message", "Book deleted successfully"
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 409,
                    "message", e.getMessage()
            ));
        } catch (BookNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 404,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 500,
                    "message", "Failed to delete book: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/createBook")
    public ResponseEntity<?> createBook(@RequestBody CreateBookRequest request) {
        String bookId = bookService.createBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 201,
                "message", "Book created successfully",
                "bookId", bookId
        ));
    }

    @PostMapping("/rating")
    public ResponseEntity<?> rateBook(@RequestBody RatingRequest request, HttpSession session){
        try {
            String userId = (String) session.getAttribute("userId");
            bookService.rateBook(request, userId);
            return ResponseEntity.ok(Map.of("message", "Book Rating updated successfully"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 409,
                    "message", e.getMessage()
            ));
        } catch (BookNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 404,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 500,
                    "message", "Failed to rate book: " + e.getMessage()
            ));
        }
    }
}

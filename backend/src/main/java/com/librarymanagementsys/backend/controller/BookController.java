package com.librarymanagementsys.backend.controller;

import com.librarymanagementsys.backend.dto.CreateBookRequest;
import com.librarymanagementsys.backend.dto.UpdateBookRequest;
import com.librarymanagementsys.backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        bookService.deleteBook(bookId);
        return ResponseEntity.ok(Map.of("message", "Book deleted successfully"));
    }

    @PostMapping("/createBook")
    public ResponseEntity<?> createBook(@RequestBody CreateBookRequest request) {
        bookService.createBook(request);
        return ResponseEntity.ok(Map.of(
                "timestamp", System.currentTimeMillis(),
                "status", 200,
                "message", "Book created successfully"
        ));
    }
}

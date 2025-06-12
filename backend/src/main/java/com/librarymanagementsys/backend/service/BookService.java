package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.exception.BookNotFoundException;
import com.librarymanagementsys.backend.model.Book;
import com.librarymanagementsys.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        try{
            return bookRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving books: " + e.getMessage());
        }
    }

    public Book getBookById(String bookId) {
        try{
            return bookRepository.findById(bookId)
                    .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving book: " + e.getMessage());
        }
    }
}

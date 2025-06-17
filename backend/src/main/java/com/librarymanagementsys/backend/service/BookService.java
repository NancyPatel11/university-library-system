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

    public List<Book> searchBooks(String keyword) {
        try {
            List<Book> books = bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrGenreContainingIgnoreCase(keyword, keyword, keyword);
            if (books.isEmpty()) {
                return List.of(); // Return an empty list if no books found
            }
            return books;
        } catch (Exception e) {
            throw new RuntimeException("Error searching books: " + e.getMessage());
        }
    }

    public void deleteBook(String bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));

        try {
            bookRepository.delete(book);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting book: " + e.getMessage());
        }
    }
}

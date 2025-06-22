package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.dto.CreateBookRequest;
import com.librarymanagementsys.backend.dto.UpdateBookRequest;
import com.librarymanagementsys.backend.exception.BookNotFoundException;
import com.librarymanagementsys.backend.model.Book;
import com.librarymanagementsys.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
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

    public void updateBook(String id, UpdateBookRequest updatedBookData) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        int originalTotal = existingBook.getTotal_copies();
        int originalAvailable = existingBook.getAvailable_copies();
        int borrowed = originalTotal - originalAvailable;

        int newTotal = updatedBookData.getTotal_copies();

        // Check if new total is less than books already borrowed
        if (newTotal < borrowed) {
            throw new IllegalArgumentException("Cannot reduce total copies below borrowed count (" + borrowed + ")");
        }

        // Safe to update — adjust available copies
        int newAvailable = newTotal - borrowed;
        existingBook.setAvailable_copies(newAvailable);
        existingBook.setTotal_copies(newTotal);

        existingBook.setTitle(updatedBookData.getTitle());
        existingBook.setAuthor(updatedBookData.getAuthor());
        existingBook.setGenre(updatedBookData.getGenre());
        existingBook.setColor(updatedBookData.getColor());
        existingBook.setDescription(updatedBookData.getDescription());
        existingBook.setCover(updatedBookData.getCover());
        existingBook.setVideo(updatedBookData.getVideo());
        existingBook.setSummary(updatedBookData.getSummary());

        try {
            bookRepository.save(existingBook);
        } catch (Exception e) {
            throw new RuntimeException("Error updating book: " + e.getMessage());
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

    public void createBook(CreateBookRequest request) {
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setGenre(request.getGenre());
        book.setTotal_copies(request.getTotal_copies());
        book.setColor(request.getColor());
        book.setDescription(request.getDescription());
        book.setCover(request.getCover());
        book.setVideo(request.getVideo());
        book.setSummary(request.getSummary());
        book.setAvailable_copies(request.getTotal_copies()); // Initially, all copies are available
        book.setRating(0); // Initial rating is set to 0
        book.setNo_of_ratings(0); // Initial number of ratings is set to 0
        book.setCreatedAt(new Date()); // Set the creation date to now

        try {
            bookRepository.save(book);
        } catch (Exception e) {
            throw new RuntimeException("Error creating book: " + e.getMessage());
        }
    }


}

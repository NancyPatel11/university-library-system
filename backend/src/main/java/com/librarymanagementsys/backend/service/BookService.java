package com.librarymanagementsys.backend.service;

import com.librarymanagementsys.backend.dto.CreateBookRequest;
import com.librarymanagementsys.backend.dto.RatingRequest;
import com.librarymanagementsys.backend.dto.UpdateBookRequest;
import com.librarymanagementsys.backend.exception.BookNotFoundException;
import com.librarymanagementsys.backend.model.Book;
import com.librarymanagementsys.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
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

        if(book.getAvailable_copies() != book.getTotal_copies()){
            throw new IllegalStateException("Cannot delete book with borrowed copies.");
        }

        try {
            bookRepository.delete(book);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting book: " + e.getMessage());
        }
    }

    public String createBook(CreateBookRequest request) {
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
        book.setRatedBy(new HashMap<>()); // Initialize ratedBy map
        book.setCreatedAt(new Date()); // Set the creation date to now

        try {
            bookRepository.save(book);
            return book.getId(); // Return the ID of the newly created book
        } catch (Exception e) {
            throw new RuntimeException("Error creating book: " + e.getMessage());
        }
    }

    public void rateBook(RatingRequest request, String userId) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + request.getBookId()));

        // Initialize map if null
        if (book.getRatedBy() == null) {
            book.setRatedBy(new HashMap<>());
        }

        // Check if user already rated
        if (book.getRatedBy().containsKey(userId)) {
            throw new IllegalStateException("User has already rated this book");
        }

        try {
            int newRating = request.getRating();

            // Add the new rating to the map first
            book.getRatedBy().put(userId, newRating);

            // Recalculate the average rating
            float total = 0;
            for (int rating : book.getRatedBy().values()) {
                total += rating;
            }

            float averageRating = total / book.getRatedBy().size();

            // Update the book rating
            book.setRating(averageRating);

            bookRepository.save(book);
        } catch (Exception e) {
            throw new RuntimeException("Error updating book rating: " + e.getMessage());
        }
    }

}

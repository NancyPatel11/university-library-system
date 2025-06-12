package com.librarymanagementsys.backend.repository;

import com.librarymanagementsys.backend.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    // This interface will automatically provide CRUD operations for the Book entity
}

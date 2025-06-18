package com.librarymanagementsys.backend.repository;

import com.librarymanagementsys.backend.model.BorrowRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BorrowRequestRepository extends MongoRepository<BorrowRequest, String> {
     BorrowRequest findByStudentEmailAndBookId(String studentEmail, String bookId);
}

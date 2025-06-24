package com.librarymanagementsys.backend.repository;

import com.librarymanagementsys.backend.model.BorrowRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRequestRepository extends MongoRepository<BorrowRequest, String> {
     List<BorrowRequest> findByStudentIdAndBookId(String studentId, String bookId);
     List<BorrowRequest> findByStudentId(String studentId);
}

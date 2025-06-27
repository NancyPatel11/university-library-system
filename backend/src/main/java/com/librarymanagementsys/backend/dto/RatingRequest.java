package com.librarymanagementsys.backend.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private int rating;
    private String bookId;
}

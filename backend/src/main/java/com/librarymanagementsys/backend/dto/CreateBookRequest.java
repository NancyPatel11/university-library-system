package com.librarymanagementsys.backend.dto;

import lombok.Data;

@Data
public class CreateBookRequest {
    private String title;
    private String author;
    private String genre;
    private int total_copies;
    private String color;
    private String description;
    private String cover;
    private String video;
    private String summary;
}
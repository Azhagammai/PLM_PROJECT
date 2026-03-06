package com.partgenerator.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GeneratePartRequest {

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Subcategory is required")
    private String subcategory;

    @NotBlank(message = "Material is required")
    private String material;

    @NotBlank(message = "Plant is required")
    private String plant;

    private String revision = "A";

    @NotBlank(message = "Description is required")
    private String description;

    private String owner = "student6";
}

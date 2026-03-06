package com.partgenerator.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "parts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "part_number", unique = true, nullable = false, length = 60)
    private String partNumber;

    @Column(nullable = false, length = 255)
    @NotBlank(message = "Description is required")
    private String description;

    @Column(nullable = false, length = 10)
    @NotBlank(message = "Category is required")
    private String category;

    @Column(nullable = false, length = 10)
    @NotBlank(message = "Subcategory is required")
    private String subcategory;

    @Column(nullable = false, length = 5)
    @NotBlank(message = "Material is required")
    private String material;

    @Column(nullable = false, length = 5)
    @NotBlank(message = "Plant is required")
    private String plant;

    @Column(nullable = false, length = 2)
    private String revision;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PartStatus status = PartStatus.IN_REVIEW;

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String owner = "student6";

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PartStatus {
        IN_REVIEW,
        RELEASED,
        OBSOLETE
    }
}

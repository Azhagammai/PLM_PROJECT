package com.partgenerator.repository;

import com.partgenerator.model.Part;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {

    // ── Find by exact part number ─────────────────────────────
    Optional<Part> findByPartNumber(String partNumber);

    // ── Check if part number already exists ───────────────────
    boolean existsByPartNumber(String partNumber);

    // ── Full-text search across part number, description, owner
    @Query("""
        SELECT p FROM Part p
        WHERE (:query IS NULL OR :query = ''
               OR LOWER(p.partNumber)  LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(p.owner)       LIKE LOWER(CONCAT('%', :query, '%')))
          AND (:status IS NULL OR :status = '' OR CAST(p.status AS string) = :status)
          AND (:category IS NULL OR :category = '' OR p.category = :category)
        ORDER BY p.createdAt DESC
        """)
    Page<Part> search(
        @Param("query")    String query,
        @Param("status")   String status,
        @Param("category") String category,
        Pageable pageable
    );

    // ── Filter by category only ───────────────────────────────
    List<Part> findByCategoryOrderByCreatedAtDesc(String category);

    // ── Filter by status only ─────────────────────────────────
    List<Part> findByStatusOrderByCreatedAtDesc(Part.PartStatus status);

    // ── Analytics: count by status ────────────────────────────
    long countByStatus(Part.PartStatus status);

    // ── Analytics: count by category ─────────────────────────
    @Query("SELECT p.category, COUNT(p) FROM Part p GROUP BY p.category")
    List<Object[]> countByCategory();

    // ── Recent parts (last 10) ────────────────────────────────
    List<Part> findTop10ByOrderByCreatedAtDesc();
}

package com.partgenerator.service;

import com.partgenerator.dto.GeneratePartRequest;
import com.partgenerator.dto.PartResponse;
import com.partgenerator.exception.PartNotFoundException;
import com.partgenerator.model.Part;
import com.partgenerator.repository.PartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PartService {

    private final PartRepository partRepository;
    private final PartNumberService partNumberService;

    // ─────────────────────────────────────────────────────────
    //  GENERATE & SAVE a new part
    // ─────────────────────────────────────────────────────────
    @Transactional
    public PartResponse generateAndSave(GeneratePartRequest request) {
        log.info("Generating part for category={} subcategory={} material={} plant={} revision={}",
                request.getCategory(), request.getSubcategory(),
                request.getMaterial(), request.getPlant(), request.getRevision());

        // Build the part number using the rules engine
        String partNumber = partNumberService.generatePartNumber(
                request.getCategory(),
                request.getSubcategory(),
                request.getMaterial(),
                request.getPlant(),
                request.getRevision()
        );

        // Build and persist the Part entity
        Part part = Part.builder()
                .partNumber(partNumber)
                .description(request.getDescription())
                .category(request.getCategory().toUpperCase())
                .subcategory(request.getSubcategory().toUpperCase())
                .material(request.getMaterial().toUpperCase())
                .plant(request.getPlant().toUpperCase())
                .revision(request.getRevision().toUpperCase())
                .status(Part.PartStatus.IN_REVIEW)
                .owner(request.getOwner() != null ? request.getOwner() : "student6")
                .quantity(0)
                .build();

        Part saved = partRepository.save(part);
        log.info("Part saved successfully: {}", saved.getPartNumber());

        return PartResponse.fromPart(saved);
    }

    // ─────────────────────────────────────────────────────────
    //  SEARCH & FILTER parts
    // ─────────────────────────────────────────────────────────
    public Page<PartResponse> search(String query, String status, String category,
                                      int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Part> parts = partRepository.search(query, status, category, pageable);
        return parts.map(PartResponse::fromPart);
    }

    // ─────────────────────────────────────────────────────────
    //  GET a single part by ID
    // ─────────────────────────────────────────────────────────
    public PartResponse getById(Long id) {
        Part part = partRepository.findById(id)
                .orElseThrow(() -> new PartNotFoundException("Part not found with id: " + id));
        return PartResponse.fromPart(part);
    }

    // ─────────────────────────────────────────────────────────
    //  GET a single part by part number
    // ─────────────────────────────────────────────────────────
    public PartResponse getByPartNumber(String partNumber) {
        Part part = partRepository.findByPartNumber(partNumber)
                .orElseThrow(() -> new PartNotFoundException("Part not found: " + partNumber));
        return PartResponse.fromPart(part);
    }

    // ─────────────────────────────────────────────────────────
    //  GET all parts (with pagination)
    // ─────────────────────────────────────────────────────────
    public Page<PartResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return partRepository.findAll(pageable).map(PartResponse::fromPart);
    }

    // ─────────────────────────────────────────────────────────
    //  GET recent parts (last 10)
    // ─────────────────────────────────────────────────────────
    public List<PartResponse> getRecent() {
        return partRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(PartResponse::fromPart)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────
    //  UPDATE status of a part
    // ─────────────────────────────────────────────────────────
    @Transactional
    public PartResponse updateStatus(Long id, String statusStr) {
        Part part = partRepository.findById(id)
                .orElseThrow(() -> new PartNotFoundException("Part not found with id: " + id));

        try {
            Part.PartStatus newStatus = Part.PartStatus.valueOf(statusStr.toUpperCase());
            part.setStatus(newStatus);
            Part updated = partRepository.save(part);
            log.info("Part {} status updated to {}", updated.getPartNumber(), newStatus);
            return PartResponse.fromPart(updated);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + statusStr
                    + ". Must be IN_REVIEW, RELEASED, or OBSOLETE");
        }
    }

    // ─────────────────────────────────────────────────────────
    //  DELETE a part
    // ─────────────────────────────────────────────────────────
    @Transactional
    public void delete(Long id) {
        if (!partRepository.existsById(id)) {
            throw new PartNotFoundException("Part not found with id: " + id);
        }
        partRepository.deleteById(id);
        log.info("Part with id {} deleted", id);
    }

    // ─────────────────────────────────────────────────────────
    //  ANALYTICS — summary stats for dashboard
    // ─────────────────────────────────────────────────────────
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        long total     = partRepository.count();
        long released  = partRepository.countByStatus(Part.PartStatus.RELEASED);
        long inReview  = partRepository.countByStatus(Part.PartStatus.IN_REVIEW);
        long obsolete  = partRepository.countByStatus(Part.PartStatus.OBSOLETE);

        analytics.put("total",    total);
        analytics.put("released", released);
        analytics.put("inReview", inReview);
        analytics.put("obsolete", obsolete);
        analytics.put("currentSerial", partNumberService.getCurrentCounter());

        // Category breakdown
        Map<String, Long> byCategory = new HashMap<>();
        partRepository.countByCategory()
                .forEach(row -> byCategory.put((String) row[0], (Long) row[1]));
        analytics.put("byCategory", byCategory);

        // Recent parts
        analytics.put("recent", getRecent());

        return analytics;
    }
}

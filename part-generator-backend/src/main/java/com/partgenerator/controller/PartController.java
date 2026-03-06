package com.partgenerator.controller;

import com.partgenerator.dto.ApiResponse;
import com.partgenerator.dto.GeneratePartRequest;
import com.partgenerator.dto.PartResponse;
import com.partgenerator.dto.UpdateStatusRequest;
import com.partgenerator.service.PartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * PartController — exposes all REST API endpoints
 *
 * Base URL: http://localhost:8080/api
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  POST   /api/parts/generate          Generate new part      │
 * │  GET    /api/parts                   Get all parts (paged)  │
 * │  GET    /api/parts/{id}              Get one part by ID     │
 * │  GET    /api/parts/number/{pn}       Get by part number     │
 * │  GET    /api/parts/search            Search & filter        │
 * │  GET    /api/parts/recent            Last 10 parts          │
 * │  PATCH  /api/parts/{id}/status       Update status          │
 * │  DELETE /api/parts/{id}              Delete a part          │
 * │  GET    /api/analytics               Dashboard stats        │
 * │  GET    /api/health                  Health check           │
 * └─────────────────────────────────────────────────────────────┘
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class PartController {

    private final PartService partService;

    // ── Health Check ─────────────────────────────────────────
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status",  "UP",
                "service", "Part Number Generator",
                "version", "1.0.0"
        ));
    }

    // ── Generate a new part number and save to DB ─────────────
    @PostMapping("/parts/generate")
    public ResponseEntity<ApiResponse<PartResponse>> generate(
            @Valid @RequestBody GeneratePartRequest request) {

        log.info("POST /api/parts/generate - category={}", request.getCategory());
        PartResponse part = partService.generateAndSave(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(part, "Part number generated successfully: " + part.getPartNumber()));
    }

    // ── Get all parts (paginated) ─────────────────────────────
    @GetMapping("/parts")
    public ResponseEntity<ApiResponse<Page<PartResponse>>> getAll(
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "20")  int size) {

        Page<PartResponse> parts = partService.getAll(page, size);
        return ResponseEntity.ok(ApiResponse.ok(parts, "Parts retrieved successfully"));
    }

    // ── Get one part by database ID ───────────────────────────
    @GetMapping("/parts/{id}")
    public ResponseEntity<ApiResponse<PartResponse>> getById(@PathVariable Long id) {
        PartResponse part = partService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(part, "Part found"));
    }

    // ── Get one part by part number string ───────────────────
    @GetMapping("/parts/number/{partNumber}")
    public ResponseEntity<ApiResponse<PartResponse>> getByPartNumber(
            @PathVariable String partNumber) {
        PartResponse part = partService.getByPartNumber(partNumber);
        return ResponseEntity.ok(ApiResponse.ok(part, "Part found"));
    }

    // ── Search & filter parts ─────────────────────────────────
    // Example: GET /api/parts/search?q=MECH&status=RELEASED&category=MECH&page=0&size=20
    @GetMapping("/parts/search")
    public ResponseEntity<ApiResponse<Page<PartResponse>>> search(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "") String status,
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("GET /api/parts/search - q={} status={} category={}", q, status, category);
        Page<PartResponse> results = partService.search(q, status, category, page, size);
        return ResponseEntity.ok(ApiResponse.ok(results,
                "Found " + results.getTotalElements() + " parts"));
    }

    // ── Get 10 most recently created parts ────────────────────
    @GetMapping("/parts/recent")
    public ResponseEntity<ApiResponse<List<PartResponse>>> getRecent() {
        List<PartResponse> recent = partService.getRecent();
        return ResponseEntity.ok(ApiResponse.ok(recent, "Recent parts retrieved"));
    }

    // ── Update part status ────────────────────────────────────
    // Body: { "status": "RELEASED" }
    @PatchMapping("/parts/{id}/status")
    public ResponseEntity<ApiResponse<PartResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {

        log.info("PATCH /api/parts/{}/status - newStatus={}", id, request.getStatus());
        PartResponse updated = partService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok(updated,
                "Status updated to " + request.getStatus()));
    }

    // ── Delete a part ─────────────────────────────────────────
    @DeleteMapping("/parts/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        log.info("DELETE /api/parts/{}", id);
        partService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Part deleted successfully"));
    }

    // ── Analytics dashboard data ──────────────────────────────
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> analytics() {
        Map<String, Object> data = partService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.ok(data, "Analytics retrieved"));
    }
}

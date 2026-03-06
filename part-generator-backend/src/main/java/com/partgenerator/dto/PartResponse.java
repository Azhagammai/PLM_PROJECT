package com.partgenerator.dto;

import com.partgenerator.model.Part;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PartResponse {

    private Long id;
    private String partNumber;
    private String description;
    private String category;
    private String subcategory;
    private String material;
    private String plant;
    private String revision;
    private String status;
    private String owner;
    private Integer quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PartResponse fromPart(Part p) {
        PartResponse r = new PartResponse();
        r.setId(p.getId());
        r.setPartNumber(p.getPartNumber());
        r.setDescription(p.getDescription());
        r.setCategory(p.getCategory());
        r.setSubcategory(p.getSubcategory());
        r.setMaterial(p.getMaterial());
        r.setPlant(p.getPlant());
        r.setRevision(p.getRevision());
        r.setStatus(p.getStatus().name());
        r.setOwner(p.getOwner());
        r.setQuantity(p.getQuantity());
        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());
        return r;
    }
}

package com.partgenerator.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "part_counter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartCounter {

    @Id
    private Long id;   // Always 1 — single row table

    @Column(name = "current_value", nullable = false)
    private Long currentValue;
}

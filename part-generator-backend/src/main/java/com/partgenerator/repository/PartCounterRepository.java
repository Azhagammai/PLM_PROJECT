package com.partgenerator.repository;

import com.partgenerator.model.PartCounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartCounterRepository extends JpaRepository<PartCounter, Long> {
    // Single-row table — always use id = 1
}
